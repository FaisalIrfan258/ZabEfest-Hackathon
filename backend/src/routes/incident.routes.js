const express = require('express');
const { incident: incidentController } = require('../controllers');
const { auth, upload } = require('../middleware');
const { validator } = require('../utils');

const router = express.Router();

// Public routes
router.get('/', incidentController.getIncidents);
router.get('/:id', incidentController.getIncident);

// Protected routes
router.post(
  '/',
  auth.protect,
  auth.updateLastActive,
  upload.uploadMultiple('images', 5),
  validator.validateRequest(validator.incidentValidator),
  incidentController.createIncident
);

router.put(
  '/:id',
  auth.protect,
  auth.updateLastActive,
  incidentController.updateIncident
);

router.delete(
  '/:id',
  auth.protect,
  auth.updateLastActive,
  incidentController.deleteIncident
);

router.put(
  '/:id/status',
  auth.protect,
  auth.updateLastActive,
  validator.validateRequest(validator.statusUpdateValidator),
  incidentController.updateStatus
);

router.put(
  '/:id/verify',
  auth.protect,
  auth.updateLastActive,
  incidentController.verifyIncident
);

router.put(
  '/:id/follow',
  auth.protect,
  auth.updateLastActive,
  incidentController.followIncident
);

router.put(
  '/:id/images',
  auth.protect,
  auth.updateLastActive,
  upload.uploadMultiple('images', 5),
  incidentController.uploadImages
);

module.exports = router; 