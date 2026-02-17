const express = require('express');
const router = express.Router();
const authService = require('../service/auth.service');
const { requireAuth } = require('../middleware/auth.middleware');

function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

function sendGenericError(res, err) {
  console.error('Auth error:', err.message || err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { role, email, password, name } = req.body;
    const result = await authService.register(role, { email, password, name });
    res.status(201).json(result);
  } catch (err) {
    const msg = err.message || 'Registration failed';
    if (msg.includes('Invalid role') || msg.includes('required') || msg.includes('already exists') || msg.includes('at least 8')) {
      return sendError(res, 400, msg);
    }
    sendGenericError(res, err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[auth] login attempt', { email: email || '(missing)', role: role || '(missing)', hasPassword: !!password });
    }
    const result = await authService.login(email, password, role);
    res.json(result);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[auth] login failed:', err.message);
    }
    const msg = err.message || 'Login failed';
    if (msg.includes('Invalid email or password')) {
      return sendError(res, 401, msg);
    }
    if (msg.includes('Invalid role') || msg.includes('required')) {
      return sendError(res, 400, msg);
    }
    sendGenericError(res, err);
  }
});

// PUT /api/auth/changepassword
router.put('/changepassword', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await authService.changePassword(
      req.user.id,
      req.user.role,
      currentPassword,
      newPassword
    );
    res.json(user);
  } catch (err) {
    const msg = err.message || 'Password change failed';
    if (msg.includes('not found') || msg.includes('Current password is incorrect')) {
      return sendError(res, 401, msg);
    }
    if (msg.includes('required') || msg.includes('at least 8')) {
      return sendError(res, 400, msg);
    }
    sendGenericError(res, err);
  }
});

// PUT /api/auth/changeemail
router.put('/changeemail', requireAuth, async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const user = await authService.changeEmail(
      req.user.id,
      req.user.role,
      newEmail,
      password
    );
    res.json(user);
  } catch (err) {
    const msg = err.message || 'Email change failed';
    if (msg.includes('not found') || msg.includes('Password is incorrect')) {
      return sendError(res, 401, msg);
    }
    if (msg.includes('already in use') || msg.includes('required')) {
      return sendError(res, 400, msg);
    }
    sendGenericError(res, err);
  }
});

module.exports = router;
