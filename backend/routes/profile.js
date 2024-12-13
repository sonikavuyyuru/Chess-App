const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// @route   GET /api/profile
router.get('/', auth, getUserProfile);

// @route   PUT /api/profile
router.put('/', auth, updateUserProfile);

module.exports = router;