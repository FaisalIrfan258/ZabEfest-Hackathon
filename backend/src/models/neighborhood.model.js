const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Neighborhood name is required'],
      trim: true,
      unique: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    boundaries: {
      type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon',
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
        required: true,
      },
    },
    center: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere',
    },
    environmentalScore: {
      type: Number,
      default: 100, // Starts with perfect score
      min: 0,
      max: 100,
    },
    scoreHistory: [{
      score: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      reason: String,
    }],
    scoreBreakdown: {
      wasteScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      waterScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      airScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      habitatScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
      noiseScore: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },
    },
    activeIncidents: {
      type: Number,
      default: 0,
    },
    resolvedIncidents: {
      type: Number,
      default: 0,
    },
    totalIncidents: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    improvementGoals: [{
      category: {
        type: String,
        enum: ['waste', 'water', 'air', 'habitat', 'noise'],
        required: true,
      },
      targetScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      deadline: Date,
      description: String,
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

// Create indexes for efficient querying
neighborhoodSchema.index({ name: 1, city: 1, state: 1, country: 1 }, { unique: true });
neighborhoodSchema.index({ environmentalScore: 1 });
neighborhoodSchema.index({ center: '2dsphere' });

// Method to update environmental score based on incidents
neighborhoodSchema.methods.updateScore = function() {
  // This is a simplified score calculation
  // In a real implementation, you would have a more complex algorithm
  // that considers various factors like incident types, severity, etc.
  const wasteImpact = Math.max(0, this.scoreBreakdown.wasteScore);
  const waterImpact = Math.max(0, this.scoreBreakdown.waterScore);
  const airImpact = Math.max(0, this.scoreBreakdown.airScore);
  const habitatImpact = Math.max(0, this.scoreBreakdown.habitatScore);
  const noiseImpact = Math.max(0, this.scoreBreakdown.noiseScore);
  
  // Calculate overall score (equal weight to all categories)
  const newScore = (wasteImpact + waterImpact + airImpact + habitatImpact + noiseImpact) / 5;
  
  // Add to score history if score changed
  if (this.environmentalScore !== newScore) {
    this.scoreHistory.push({
      score: newScore,
      date: Date.now(),
      reason: 'Periodic score update',
    });
    
    this.environmentalScore = newScore;
  }
  
  this.lastUpdated = Date.now();
  return this.save();
};

// Static method to find neighborhoods by geographic location
neighborhoodSchema.statics.findByLocation = function(longitude, latitude) {
  return this.find({
    boundaries: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
    },
  });
};

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

module.exports = Neighborhood; 