const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'waste_dumping',
        'water_pollution',
        'air_pollution',
        'deforestation',
        'noise_pollution',
        'wildlife_endangerment',
        'habitat_destruction',
        'soil_contamination',
        'other'
      ],
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        index: '2dsphere',
      },
      neighborhood: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    images: [{
      url: {
        type: String,
        required: true,
      },
      publicId: String,
      caption: String,
    }],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['reported', 'verified', 'in_progress', 'resolved', 'rejected'],
      default: 'reported',
    },
    statusHistory: [{
      status: {
        type: String,
        enum: ['reported', 'verified', 'in_progress', 'resolved', 'rejected'],
        required: true,
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      note: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    verifiedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      comment: String,
    }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationCount: {
      type: Number,
      default: 0,
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    resolutionDetails: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      resolutionDate: Date,
      resolutionDescription: String,
      resolutionImages: [{
        url: String,
        publicId: String,
        caption: String,
      }],
    },
    environmentalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
incidentSchema.index({ category: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ 'location.city': 1 });
incidentSchema.index({ 'location.coordinates': '2dsphere' });

// Method to update verification count
incidentSchema.methods.updateVerificationCount = function() {
  this.verificationCount = this.verifiedBy.length;
  
  // Automatically update status to verified if threshold is met
  if (this.status === 'reported' && this.verificationCount >= 3) {
    this.status = 'verified';
    this.statusHistory.push({
      status: 'verified',
      changedBy: this.verifiedBy[this.verifiedBy.length - 1].user,
      note: 'Automatically verified by community',
      timestamp: Date.now()
    });
  }
  
  return this.save();
};

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident; 