const express = require('express');
const { event: eventController } = require('../controllers');
const { auth, upload } = require('../middleware');
const { validator } = require('../utils');

const router = express.Router();

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);

// Protected routes
router.post(
  '/',
  auth.protect,
  auth.updateLastActive,
  upload.uploadSingle('image'),
  validator.validateRequest(validator.eventValidator),
  eventController.createEvent
);

router.put(
  '/:id',
  auth.protect,
  auth.updateLastActive,
  eventController.updateEvent
);

router.put(
  '/:id/register',
  auth.protect,
  auth.updateLastActive,
  eventController.registerForEvent
);

router.put(
  '/:id/cancel',
  auth.protect,
  auth.updateLastActive,
  eventController.cancelEvent
);

module.exports = router; 