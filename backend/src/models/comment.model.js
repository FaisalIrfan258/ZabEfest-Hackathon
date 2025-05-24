const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      url: String,
      publicId: String,
      type: {
        type: String,
        enum: ['image', 'document', 'video'],
      },
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  },
  { timestamps: true }
);

// Create indexes for efficient querying
commentSchema.index({ incident: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ createdAt: -1 });

// Static method to find non-deleted comments for an incident
commentSchema.statics.findActiveByIncident = function(incidentId) {
  return this.find({ 
    incident: incidentId,
    isDeleted: false,
    parentComment: { $exists: false }
  })
  .populate('author', 'name profilePicture')
  .populate({
    path: 'replies',
    match: { isDeleted: false },
    populate: { path: 'author', select: 'name profilePicture' }
  })
  .sort({ createdAt: -1 });
};

// Method to soft delete a comment
commentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.content = '[Comment deleted]';
  return this.save();
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 