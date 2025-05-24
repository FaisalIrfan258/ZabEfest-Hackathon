const express = require('express');
const { comment: commentController } = require('../controllers');
const { auth } = require('../middleware');
const { validator } = require('../utils');

const router = express.Router();

// Public routes
router.get('/incident/:incidentId', commentController.getIncidentComments);

// Protected routes
router.post(
  '/',
  auth.protect,
  auth.updateLastActive,
  validator.validateRequest(validator.commentValidator),
  commentController.addComment
);

router.delete(
  '/:id',
  auth.protect,
  auth.updateLastActive,
  commentController.deleteComment
);

module.exports = router; 