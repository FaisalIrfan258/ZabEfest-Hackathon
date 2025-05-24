const authController = require('./auth.controller');
const incidentController = require('./incident.controller');
const commentController = require('./comment.controller');
const dashboardController = require('./dashboard.controller');
const eventController = require('./event.controller');

module.exports = {
  auth: authController,
  incident: incidentController,
  comment: commentController,
  dashboard: dashboardController,
  event: eventController,
}; 