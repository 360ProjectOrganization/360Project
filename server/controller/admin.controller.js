const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
const multer = require('multer');

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
const ROLE = 'administrator';

// GET: api/admin
router.get('/', async (req, res) => {
  try{
    const admin = await userService.getAll();
    res.json(admin)
  } catch (error){
    res.status(500).json({ error: 'Failed to fetch admin' });
  }
} )

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
router.put('/:id/pfp', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await userService.updatePfp(ROLE, req.params.id, req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

module.exports = router;
