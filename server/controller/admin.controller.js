const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
const adminService = require('../service/admin.service');
const { multerPfpSingle } = require('../middleware/pfpUpload');

const ROLE = 'administrator';

function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

function sendGenericError(res, err) {
  console.error('Admin error:', err.message || err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

// GET: api/admin
router.get('/', async (req, res) => {
  try {
    const result = await adminService.getAllAdmins();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch administrators' });
  }
});
// GET: api/admin/allJobPostingAnalytics
router.get('/allJobPostingAnalytics', async (req, res) => {
    try {
      const analytics = await adminService.findAllAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch job posting analytics' });
    }
  });
// PATCH: api/admin/:role/:id/status
router.patch('/:role/:id/status', async (req, res) => {
  try {
    const { role, id } = req.params;
    const { status } = req.body;
    if (!['applicant', 'company', 'administrator'].includes(role)) {
      return sendError(res, 400, 'Invalid role');
    }
    if (!['active', 'inactive'].includes(status)) {
      return sendError(res, 400, 'Invalid status');
    }
    const result = await userService.changeStatus(role, id, status);
    res.json(result);
  } catch (err) {
    const msg = err.message || 'Status change failed';
    if (msg.includes('User not found')) {
      return sendError(res, 404, msg);
    }
    sendGenericError(res, err);
  }
});

// GET: api/admin/:id/pfp
router.get('/:id/pfp', async (req, res) => {
  try {
    const { buffer, contentType } = await userService.getPfp(ROLE, req.params.id);
    const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer?.data ?? []);
    res.type(contentType).send(body);
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'No profile picture') {
      return res.status(404).end();
    }
    res.status(500).end();
  }
});

// PUT: api/admin/:id/pfp
router.put('/:id/pfp', multerPfpSingle('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await userService.updatePfp(ROLE, req.params.id, req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});
// POST: api/admin/:id/delete
router.post('/:id/delete', async (req, res) => {
  try {
    await userService.deleteAccount(ROLE, req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Failed to delete account' });
  }
});
// POST: api/admin/:id/edit
router.post('/:id/edit', async (req, res) => {
  try {
    const { name, email, role, password} = req.body;
    const result = await adminService.updateAdmin(req.params.id, { name, email, role, password });
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update administrator' });
  }
});


module.exports = router;
