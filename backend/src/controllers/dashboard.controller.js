const { Incident, User, Neighborhood, Event } = require('../models');

/**
 * @desc    Get user dashboard data
 * @route   GET /api/dashboard/user
 * @access  Private
 */
exports.getUserDashboard = async (req, res, next) => {
  try {
    // Get user with populated incidents
    const user = await User.findById(req.user._id)
      .populate({
        path: 'reportedIncidents',
        select: 'title description status category severity location images createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 },
      })
      .populate({
        path: 'followedIncidents',
        select: 'title description status category severity location images createdAt',
        options: { sort: { createdAt: -1 }, limit: 5 },
      });

    // Get counts
    const reportedCount = await Incident.countDocuments({
      reporter: req.user._id,
    });

    const followedCount = await Incident.countDocuments({
      followers: req.user._id,
    });

    const verifiedCount = await Incident.countDocuments({
      'verifiedBy.user': req.user._id,
    });

    // Get upcoming events the user is attending
    const upcomingEvents = await Event.find({
      'attendees.user': req.user._id,
      'attendees.status': 'going',
      date: { $gte: new Date() },
      status: 'scheduled',
    })
      .sort({ date: 1 })
      .limit(3)
      .populate('organizer', 'name profilePicture')
      .select('title description date startTime endTime location');

    // Response data
    const dashboardData = {
      user: {
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
        points: user.points,
        badges: user.badges,
        joined: user.createdAt,
        location: user.location,
      },
      stats: {
        reportedCount,
        followedCount,
        verifiedCount,
      },
      recentReports: user.reportedIncidents,
      recentFollowed: user.followedIncidents,
      upcomingEvents,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get admin dashboard data
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin/Authority)
 */
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Get incident stats
    const reportedCount = await Incident.countDocuments({
      status: 'reported',
    });

    const verifiedCount = await Incident.countDocuments({
      status: 'verified',
    });

    const inProgressCount = await Incident.countDocuments({
      status: 'in_progress',
    });

    const resolvedCount = await Incident.countDocuments({
      status: 'resolved',
    });

    // Get counts by category
    const categoryCounts = await Incident.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get severity distribution
    const severityCounts = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1, // Sort by severity (low, medium, high, critical)
        },
      },
    ]);

    // Get recent incidents
    const recentIncidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('reporter', 'name profilePicture')
      .select('title description status category severity location createdAt');

    // Get top neighborhoods with issues
    const topNeighborhoods = await Neighborhood.find()
      .sort({ activeIncidents: -1 })
      .limit(5)
      .select('name city environmentalScore activeIncidents resolvedIncidents');

    // Get user stats
    const userCount = await User.countDocuments();
    const activeUserCount = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Active in last 30 days
    });

    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      status: 'scheduled',
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('organizer', 'name')
      .select('title date location.city eventType');

    // Response data
    const dashboardData = {
      incidentStats: {
        reportedCount,
        verifiedCount,
        inProgressCount,
        resolvedCount,
        total: reportedCount + verifiedCount + inProgressCount + resolvedCount,
      },
      categoryCounts,
      severityCounts,
      recentIncidents,
      topNeighborhoods,
      userStats: {
        userCount,
        activeUserCount,
      },
      upcomingEvents,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get neighborhood data
 * @route   GET /api/dashboard/neighborhoods
 * @access  Public
 */
exports.getNeighborhoods = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'environmentalScore' } = req.query;

    // Get neighborhoods with pagination
    const neighborhoods = await Neighborhood.find()
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('name city state country environmentalScore activeIncidents resolvedIncidents center');

    // Get total count
    const total = await Neighborhood.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        neighborhoods,
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
 * @desc    Get neighborhood detail
 * @route   GET /api/dashboard/neighborhoods/:id
 * @access  Public
 */
exports.getNeighborhoodDetail = async (req, res, next) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: 'Neighborhood not found',
      });
    }

    // Get recent incidents in this neighborhood
    const incidents = await Incident.find({
      'location.coordinates': {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: neighborhood.boundaries.coordinates,
          },
        },
      },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('reporter', 'name profilePicture')
      .select('title description status category severity location createdAt');

    // Get category distribution
    const categoryDistribution = await Incident.aggregate([
      {
        $match: {
          'location.coordinates': {
            $geoWithin: {
              $geometry: {
                type: 'Polygon',
                coordinates: neighborhood.boundaries.coordinates,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get status distribution
    const statusDistribution = await Incident.aggregate([
      {
        $match: {
          'location.coordinates': {
            $geoWithin: {
              $geometry: {
                type: 'Polygon',
                coordinates: neighborhood.boundaries.coordinates,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get upcoming events in this neighborhood
    const upcomingEvents = await Event.find({
      'location.coordinates': {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: neighborhood.boundaries.coordinates,
          },
        },
      },
      date: { $gte: new Date() },
      status: 'scheduled',
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('organizer', 'name profilePicture')
      .select('title description date startTime endTime location eventType');

    res.status(200).json({
      success: true,
      data: {
        neighborhood,
        incidents,
        categoryDistribution,
        statusDistribution,
        upcomingEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform statistics
 * @route   GET /api/dashboard/stats
 * @access  Public
 */
exports.getPlatformStats = async (req, res, next) => {
  try {
    // Get incident stats
    const totalIncidents = await Incident.countDocuments();
    const resolvedIncidents = await Incident.countDocuments({
      status: 'resolved',
    });

    // Get user stats
    const totalUsers = await User.countDocuments();

    // Get neighborhood stats
    const totalNeighborhoods = await Neighborhood.countDocuments();
    const averageScore = await Neighborhood.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$environmentalScore' },
        },
      },
    ]);

    // Get event stats
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
      status: 'scheduled',
    });

    res.status(200).json({
      success: true,
      data: {
        incidents: {
          total: totalIncidents,
          resolved: resolvedIncidents,
          resolutionRate: totalIncidents > 0 ? (resolvedIncidents / totalIncidents) * 100 : 0,
        },
        users: {
          total: totalUsers,
        },
        neighborhoods: {
          total: totalNeighborhoods,
          averageScore: averageScore.length > 0 ? averageScore[0].averageScore : 0,
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}; 