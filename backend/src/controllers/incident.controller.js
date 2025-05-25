const { Incident, User, Neighborhood } = require('../models');
const { notification } = require('../utils');

/**
 * @desc    Create new incident
 * @route   POST /api/incidents
 * @access  Private
 */
exports.createIncident = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      category, 
      severity, 
      location, 
      isAnonymous 
    } = req.body;

    // Create incident
    const incident = await Incident.create({
      title,
      description,
      category,
      severity,
      location,
      isAnonymous,
      reporter: req.user._id,
      statusHistory: [
        {
          status: 'reported',
          changedBy: req.user._id,
          timestamp: Date.now(),
          note: 'Incident reported',
        },
      ],
    });

    // Add image files if they exist
    if (req.files && req.files.length > 0) {
      incident.images = req.files.map((file) => ({
        url: file.path || file.location || file.url,
        publicId: file.filename || file.key || '',
        caption: '',
      }));
      await incident.save();
    }

    // Update user's reported incidents
    await User.findByIdAndUpdate(req.user._id, {
      $push: { reportedIncidents: incident._id },
      $inc: { points: 5 }, // Give points for reporting
    });

    // Try to find neighborhood and update stats
    try {
      const neighborhood = await Neighborhood.findOne({
        boundaries: {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: location.coordinates,
            },
          },
        },
      });

      if (neighborhood) {
        // Update neighborhood stats
        const impactFactor = severity === 'critical' ? 10 : 
                            severity === 'high' ? 7 : 
                            severity === 'medium' ? 5 : 3;
        
        // Update score based on category
        const scoreUpdate = {};
        switch (category) {
          case 'waste_dumping':
            scoreUpdate['scoreBreakdown.wasteScore'] = Math.max(0, neighborhood.scoreBreakdown.wasteScore - impactFactor);
            break;
          case 'water_pollution':
            scoreUpdate['scoreBreakdown.waterScore'] = Math.max(0, neighborhood.scoreBreakdown.waterScore - impactFactor);
            break;
          case 'air_pollution':
            scoreUpdate['scoreBreakdown.airScore'] = Math.max(0, neighborhood.scoreBreakdown.airScore - impactFactor);
            break;
          case 'noise_pollution':
            scoreUpdate['scoreBreakdown.noiseScore'] = Math.max(0, neighborhood.scoreBreakdown.noiseScore - impactFactor);
            break;
          case 'deforestation':
          case 'wildlife_endangerment':
          case 'habitat_destruction':
            scoreUpdate['scoreBreakdown.habitatScore'] = Math.max(0, neighborhood.scoreBreakdown.habitatScore - impactFactor);
            break;
          default:
            // For 'other' or any other cases
            const allScores = [
              'scoreBreakdown.wasteScore',
              'scoreBreakdown.waterScore',
              'scoreBreakdown.airScore',
              'scoreBreakdown.habitatScore',
              'scoreBreakdown.noiseScore',
            ];
            const randomScore = allScores[Math.floor(Math.random() * allScores.length)];
            scoreUpdate[randomScore] = Math.max(0, neighborhood.scoreBreakdown.wasteScore - impactFactor);
        }
        
        // Update incident counts
        await Neighborhood.findByIdAndUpdate(neighborhood._id, {
          $inc: { 
            activeIncidents: 1,
            totalIncidents: 1
          },
          $set: scoreUpdate,
          lastUpdated: Date.now(),
        });
        
        // Calculate new overall score
        await neighborhood.updateScore();
      }
    } catch (error) {
      // Don't fail the entire operation if neighborhood update fails
      console.error('Error updating neighborhood stats:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all incidents
 * @route   GET /api/incidents
 * @access  Public
 */
exports.getIncidents = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      severity,
      sort = '-createdAt',
      lat,
      lng,
      distance = 10, // in kilometers
    } = req.query;

    // Build query
    const query = {};

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add severity filter if provided
    if (severity) {
      query.severity = severity;
    }

    // Add geospatial query if coordinates provided
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance) * 1000, // Convert to meters
        },
      };
    }

    // Execute query with pagination
    const incidents = await Incident.find(query)
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('reporter', 'name profilePicture')
      .populate('verifiedBy.user', 'name profilePicture')
      .populate('assignedTo', 'name profilePicture');

    // Get total count
    const total = await Incident.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        incidents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single incident
 * @route   GET /api/incidents/:id
 * @access  Public
 */
exports.getIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name profilePicture')
      .populate('verifiedBy.user', 'name profilePicture')
      .populate('assignedTo', 'name profilePicture')
      .populate('followers', 'name profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name profilePicture',
        },
      });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update incident
 * @route   PUT /api/incidents/:id
 * @access  Private
 */
exports.updateIncident = async (req, res, next) => {
  try {
    const { title, description, category, severity } = req.body;

    // Find incident
    let incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Check if user is authorized to update
    if (
      incident.reporter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'authority'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this incident',
      });
    }

    // Update incident
    incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { title, description, category, severity },
      { new: true, runValidators: true }
    )
      .populate('reporter', 'name profilePicture')
      .populate('verifiedBy.user', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete incident
 * @route   DELETE /api/incidents/:id
 * @access  Private
 */
exports.deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Check if user is authorized to delete
    if (
      incident.reporter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this incident',
      });
    }

    // Delete incident
    await incident.remove();

    // Update user's reported incidents
    await User.findByIdAndUpdate(incident.reporter, {
      $pull: { reportedIncidents: incident._id },
    });

    res.status(200).json({
      success: true,
      message: 'Incident deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update incident status
 * @route   PUT /api/incidents/:id/status
 * @access  Private
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    // Find incident
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Store previous status for notification
    const previousStatus = incident.status;

    // Update status
    incident.status = status;
    incident.statusHistory.push({
      status,
      changedBy: req.user._id,
      note,
      timestamp: Date.now(),
    });

    // If status is resolved, add resolution details
    if (status === 'resolved') {
      incident.resolutionDetails = {
        resolvedBy: req.user._id,
        resolutionDate: Date.now(),
        resolutionDescription: note || 'Issue resolved',
      };

      // Award points to reporter for having an incident resolved
      await User.findByIdAndUpdate(incident.reporter, {
        $inc: { points: 10 },
      });

      // Try to update neighborhood stats
      try {
        const neighborhood = await Neighborhood.findOne({
          boundaries: {
            $geoIntersects: {
              $geometry: {
                type: 'Point',
                coordinates: incident.location.coordinates,
              },
            },
          },
        });

        if (neighborhood) {
          // Update incident counts
          await Neighborhood.findByIdAndUpdate(neighborhood._id, {
            $inc: { 
              activeIncidents: -1,
              resolvedIncidents: 1
            },
            lastUpdated: Date.now(),
          });
        }
      } catch (error) {
        // Don't fail the entire operation if neighborhood update fails
        console.error('Error updating neighborhood stats:', error);
      }
    }

    // If status is in_progress, assign to current user if authority
    if (status === 'in_progress' && req.user.role === 'authority') {
      incident.assignedTo = req.user._id;
    }

    await incident.save();

    // Send notification to reporter about status change
    await notification.sendStatusChangeNotification(
      incident,
      previousStatus,
      status,
      req.user._id
    );

    // Send notifications to all followers of the incident
    if (incident.followers && incident.followers.length > 0) {
      try {
        // Get push subscriptions of all followers
        const followers = await User.find({
          _id: { $in: incident.followers },
          pushSubscription: { $ne: null }
        }).select('pushSubscription');
        
        const followerSubscriptions = followers.map(follower => follower.pushSubscription);
        
        if (followerSubscriptions.length > 0) {
          // Prepare notification for followers
          const followerNotification = {
            title: 'Incident Status Updated',
            body: `Incident "${incident.title}" has been updated from ${previousStatus} to ${status}`,
            data: {
              incidentId: incident._id.toString(),
              type: 'status_change_followed',
              previousStatus,
              newStatus: status,
            },
          };
          
          // Send multicast notification to all followers
          await notification.sendMulticastNotification(followerSubscriptions, followerNotification);
        }
      } catch (error) {
        // Don't fail the main operation if follower notifications fail
        console.error('Error sending follower notifications:', error);
      }
    }

    // Populate response data
    const updatedIncident = await Incident.findById(req.params.id)
      .populate('reporter', 'name profilePicture')
      .populate('verifiedBy.user', 'name profilePicture')
      .populate('assignedTo', 'name profilePicture')
      .populate({
        path: 'statusHistory.changedBy',
        select: 'name profilePicture role',
      });

    res.status(200).json({
      success: true,
      message: `Incident status updated to ${status}`,
      data: updatedIncident,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify incident
 * @route   PUT /api/incidents/:id/verify
 * @access  Private
 */
exports.verifyIncident = async (req, res, next) => {
  try {
    const { comment } = req.body;

    // Find incident
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Check if user has already verified
    const alreadyVerified = incident.verifiedBy.some(
      (v) => v.user.toString() === req.user._id.toString()
    );

    if (alreadyVerified) {
      return res.status(400).json({
        success: false,
        message: 'You have already verified this incident',
      });
    }

    // Add verification
    incident.verifiedBy.push({
      user: req.user._id,
      timestamp: Date.now(),
      comment,
    });

    // Award points for verification
    await User.findByIdAndUpdate(req.user._id, {
      $push: { verifiedIncidents: incident._id },
      $inc: { points: 2 },
    });

    // Store current verification count for threshold check
    const previousVerificationCount = incident.verificationCount;

    // Update verification count and check if status should be updated
    await incident.updateVerificationCount();

    // Send notification about new verification
    await notification.sendVerificationNotification(incident, req.user);

    // If verification threshold was reached, send additional notification
    if (previousVerificationCount < 3 && incident.verificationCount >= 3) {
      await notification.sendVerificationThresholdNotification(incident);
    }

    // Populate response data
    const updatedIncident = await Incident.findById(req.params.id)
      .populate('reporter', 'name profilePicture')
      .populate('verifiedBy.user', 'name profilePicture')
      .populate('assignedTo', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Incident verified successfully',
      data: updatedIncident,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Follow incident
 * @route   PUT /api/incidents/:id/follow
 * @access  Private
 */
exports.followIncident = async (req, res, next) => {
  try {
    // Find incident
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Check if user already follows
    const isFollowing = incident.followers.includes(req.user._id);

    if (isFollowing) {
      // Unfollow
      incident.followers = incident.followers.filter(
        (follower) => follower.toString() !== req.user._id.toString()
      );

      // Update user's followed incidents
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { followedIncidents: incident._id },
      });

      await incident.save();

      res.status(200).json({
        success: true,
        message: 'Incident unfollowed successfully',
        data: { following: false },
      });
    } else {
      // Follow
      incident.followers.push(req.user._id);

      // Update user's followed incidents
      await User.findByIdAndUpdate(req.user._id, {
        $push: { followedIncidents: incident._id },
      });

      await incident.save();

      res.status(200).json({
        success: true,
        message: 'Incident followed successfully',
        data: { following: true },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload incident images
 * @route   PUT /api/incidents/:id/images
 * @access  Private
 */
exports.uploadImages = async (req, res, next) => {
  try {
    // Find incident
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Check if user is authorized
    if (
      incident.reporter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'authority'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images to this incident',
      });
    }

    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image',
      });
    }

    // Add images to incident
    const newImages = req.files.map((file) => ({
      url: file.path || file.location || file.url,
      publicId: file.filename || file.key || '',
      caption: '',
    }));

    incident.images = [...incident.images, ...newImages];
    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
}; 