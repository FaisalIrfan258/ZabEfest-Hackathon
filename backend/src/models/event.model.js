const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['cleanup', 'education', 'protest', 'monitoring', 'planting', 'other'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
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
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    },
    image: {
      url: String,
      publicId: String,
    },
    attendees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['going', 'maybe', 'not_going'],
        default: 'going',
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
    }],
    maxAttendees: {
      type: Number,
    },
    requirementsList: [{
      item: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      volunteers: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      }],
    }],
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    outcomeSummary: {
      success: {
        type: Boolean,
      },
      description: String,
      impactMetrics: {
        wasteCollected: Number, // in kg
        areaImproved: Number, // in square meters
        treesPlanted: Number,
        volunteersAttended: Number,
        otherMetrics: Map,
      },
      photos: [{
        url: String,
        publicId: String,
        caption: String,
      }],
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
eventSchema.index({ date: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ eventType: 1 });
eventSchema.index({ status: 1 });

// Virtual for calculating attendance count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.filter(attendee => attendee.status === 'going').length;
});

// Virtual for calculating if event is full
eventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false;
  return this.attendeeCount >= this.maxAttendees;
});

// Virtual for time until event
eventSchema.virtual('timeUntil').get(function() {
  return this.date.getTime() - Date.now();
});

// Set virtuals to show in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function() {
  return this.find({
    date: { $gte: new Date() },
    status: 'scheduled',
  })
  .sort({ date: 1 })
  .populate('organizer', 'name profilePicture');
};

// Method to register user for event
eventSchema.methods.registerAttendee = function(userId, status = 'going') {
  // Check if user is already registered
  const existingAttendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (existingAttendee) {
    // Update status if already registered
    existingAttendee.status = status;
    existingAttendee.registeredAt = Date.now();
  } else {
    // Add new attendee if not registered
    this.attendees.push({
      user: userId,
      status,
      registeredAt: Date.now(),
    });
  }
  
  return this.save();
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 