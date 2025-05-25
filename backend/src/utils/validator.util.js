const Joi = require('joi');

/**
 * User registration validation
 */
exports.registerValidator = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  cnic: Joi.string().trim().pattern(/^[0-9]{13}$/).when('role', {
    is: 'user',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  role: Joi.string().valid('user', 'authority').default('user'),
  location: Joi.string().trim().allow('', null),
  bio: Joi.string().trim().max(250).allow('', null),
});

/**
 * User login validation (using CNIC)
 */
exports.userLoginValidator = Joi.object({
  cnic: Joi.string().trim().pattern(/^[0-9]{13}$/).required(),
  password: Joi.string().required(),
});

/**
 * Admin/Authority login validation (using email)
 */
exports.adminLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Legacy login validator (kept for backward compatibility)
 */
exports.loginValidator = Joi.alternatives().try(
  exports.userLoginValidator,
  exports.adminLoginValidator
);

/**
 * Admin forgot password validation
 */
exports.adminForgotPasswordValidator = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * User forgot password validation
 */
exports.userForgotPasswordValidator = Joi.object({
  cnic: Joi.string().trim().pattern(/^[0-9]{13}$/).required(),
});

/**
 * Reset password validation
 */
exports.resetPasswordValidator = Joi.object({
  password: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  token: Joi.string().required(),
});

/**
 * Push subscription validation
 */
exports.pushSubscriptionValidator = Joi.object({
  endpoint: Joi.string().uri().required(),
  expirationTime: Joi.number().allow(null),
  keys: Joi.object({
    p256dh: Joi.string().required(),
    auth: Joi.string().required()
  }).required()
});

/**
 * User profile update validation
 */
exports.profileUpdateValidator = Joi.object({
  name: Joi.string().trim().min(3).max(50),
  bio: Joi.string().trim().max(250).allow('', null),
  location: Joi.string().trim().allow('', null),
});

/**
 * Password change validation
 */
exports.passwordChangeValidator = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(30).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

/**
 * Incident creation validation
 */
exports.incidentValidator = Joi.object({
  title: Joi.string().trim().min(5).max(100).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  category: Joi.string()
    .valid(
      'waste_dumping',
      'water_pollution',
      'air_pollution',
      'deforestation',
      'noise_pollution',
      'wildlife_endangerment',
      'habitat_destruction',
      'soil_contamination',
      'other'
    )
    .required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    neighborhood: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
  }).required(),
  isAnonymous: Joi.boolean().default(false),
});

/**
 * Incident status update validation
 */
exports.statusUpdateValidator = Joi.object({
  status: Joi.string()
    .valid('reported', 'verified', 'in_progress', 'resolved', 'rejected')
    .required(),
  note: Joi.string().trim().max(500).allow('', null),
});

/**
 * Comment validation
 */
exports.commentValidator = Joi.object({
  content: Joi.string().trim().min(2).max(1000).required(),
  isAnonymous: Joi.boolean().default(false),
  parentComment: Joi.string().allow('', null),
});

/**
 * Event creation validation
 */
exports.eventValidator = Joi.object({
  title: Joi.string().trim().min(5).max(100).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  eventType: Joi.string()
    .valid('cleanup', 'education', 'protest', 'monitoring', 'planting', 'other')
    .required(),
  date: Joi.date().min('now').required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
    city: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
  }).required(),
  relatedIncident: Joi.string().allow('', null),
  maxAttendees: Joi.number().integer().min(1).allow(null),
  requirementsList: Joi.array().items(
    Joi.object({
      item: Joi.string().required(),
      quantity: Joi.number().integer().min(1).default(1),
    })
  ),
  isPublic: Joi.boolean().default(true),
  tags: Joi.array().items(Joi.string()),
});

/**
 * Middleware for validating request
 * @param {Object} schema - Joi schema
 * @param {String} property - Request property to validate (body, params, query)
 */
exports.validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (!error) return next();

    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  };
}; 