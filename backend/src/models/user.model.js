const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for push subscription
const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    expirationTime: {
      type: Number,
      default: null,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username should be at least 3 characters long'],
    },
    cnic: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          // Only required for regular users, not for admins/authority
          if (this.role === 'user') {
            return v && v.length > 0;
          }
          return true;
        },
        message: 'CNIC is required for users'
      },
      unique: true,
      sparse: true, // Allow null/undefined values (for admins) without unique index conflicts
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'authority'],
      default: 'user',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      description: 'User\'s full address',
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: [{
      type: String,
      enum: ['reporter', 'validator', 'solver', 'leader'],
    }],
    reportedIncidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    }],
    followedIncidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    }],
    verifiedIncidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    pushSubscription: {
      type: pushSubscriptionSchema,
      default: null,
    },
    notificationSettings: {
      statusUpdates: {
        type: Boolean,
        default: true,
      },
      verifications: {
        type: Boolean,
        default: true,
      },
      followedIncidents: {
        type: Boolean,
        default: true,
      },
      systemAnnouncements: {
        type: Boolean,
        default: true,
      },
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user's public profile
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 