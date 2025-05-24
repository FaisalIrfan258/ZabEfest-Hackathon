const authMiddleware = require('./auth.middleware');
const uploadMiddleware = require('./upload.middleware');

module.exports = {
  auth: authMiddleware,
  upload: uploadMiddleware,
}; 