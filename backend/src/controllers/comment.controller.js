const { Comment, Incident, User } = require('../models');

/**
 * @desc    Add comment to incident
 * @route   POST /api/comments
 * @access  Private
 */
exports.addComment = async (req, res, next) => {
  try {
    const { content, incidentId, isAnonymous, parentComment } = req.body;

    // Check if incident exists
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      incident: incidentId,
      isAnonymous: isAnonymous || false,
      parentComment: parentComment || null,
    });

    // Update incident with new comment
    await Incident.findByIdAndUpdate(incidentId, {
      $push: { comments: comment._id },
    });

    // If this is a reply, update parent comment
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id },
      });
    }

    // Populate author data
    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name profilePicture'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for incident
 * @route   GET /api/comments/incident/:incidentId
 * @access  Public
 */
exports.getIncidentComments = async (req, res, next) => {
  try {
    const { incidentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Get top-level comments (not replies)
    const comments = await Comment.find({
      incident: incidentId,
      parentComment: null,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('author', 'name profilePicture')
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        populate: { path: 'author', select: 'name profilePicture' },
      });

    // Get total count
    const total = await Comment.countDocuments({
      incident: incidentId,
      parentComment: null,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: {
        comments,
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
 * @desc    Delete comment (soft delete)
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
exports.deleteComment = async (req, res, next) => {
  try {
    // Find comment
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is authorized
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Soft delete comment
    await comment.softDelete();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
}; 