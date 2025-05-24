const { Event, User, Incident } = require('../models');

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private
 */
exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      eventType,
      date,
      startTime,
      endTime,
      location,
      relatedIncident,
      maxAttendees,
      requirementsList,
      isPublic,
      tags,
    } = req.body;

    // Create event
    const event = await Event.create({
      title,
      description,
      eventType,
      date,
      startTime,
      endTime,
      location,
      organizer: req.user._id,
      relatedIncident,
      maxAttendees,
      requirementsList,
      isPublic,
      tags,
      attendees: [
        {
          user: req.user._id,
          status: 'going',
          registeredAt: Date.now(),
        },
      ],
    });

    // Add event image if it exists
    if (req.file) {
      event.image = {
        url: req.file.path || req.file.location || req.file.url,
        publicId: req.file.filename || req.file.key || '',
      };
      await event.save();
    }

    // Award points for creating event
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10 },
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      eventType,
      status = 'scheduled',
      sort = 'date',
      lat,
      lng,
      distance = 10, // in kilometers
    } = req.query;

    // Build query
    const query = {};

    // Only show public events for non-admin users
    if (req.user && req.user.role !== 'admin') {
      query.isPublic = true;
    }

    // Add eventType filter if provided
    if (eventType) {
      query.eventType = eventType;
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
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
    const events = await Event.find(query)
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('organizer', 'name profilePicture')
      .populate('relatedIncident', 'title category status');

    // Get total count
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        events,
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
 * @desc    Get single event
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name profilePicture email')
      .populate('relatedIncident', 'title category status')
      .populate('attendees.user', 'name profilePicture')
      .populate('requirementsList.volunteers.user', 'name profilePicture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is private and user is not organizer or admin
    if (
      !event.isPublic &&
      (!req.user ||
        (req.user._id.toString() !== event.organizer._id.toString() &&
          req.user.role !== 'admin'))
    ) {
      return res.status(403).json({
        success: false,
        message: 'This event is private',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private
 */
exports.updateEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      eventType,
      date,
      startTime,
      endTime,
      location,
      maxAttendees,
      requirementsList,
      isPublic,
      tags,
    } = req.body;

    // Find event
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is authorized to update
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        eventType,
        date,
        startTime,
        endTime,
        location,
        maxAttendees,
        requirementsList,
        isPublic,
        tags,
      },
      { new: true, runValidators: true }
    ).populate('organizer', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register for event
 * @route   PUT /api/events/:id/register
 * @access  Private
 */
exports.registerForEvent = async (req, res, next) => {
  try {
    const { status = 'going' } = req.body;

    // Find event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is full
    if (event.isFull && status === 'going') {
      return res.status(400).json({
        success: false,
        message: 'This event is already full',
      });
    }

    // Register for event
    await event.registerAttendee(req.user._id, status);

    res.status(200).json({
      success: true,
      message: `Successfully registered as ${status}`,
      data: {
        status,
        attendeeCount: event.attendeeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel event
 * @route   PUT /api/events/:id/cancel
 * @access  Private
 */
exports.cancelEvent = async (req, res, next) => {
  try {
    // Find event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is authorized
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this event',
      });
    }

    // Update event status
    event.status = 'cancelled';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event cancelled successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
}; 