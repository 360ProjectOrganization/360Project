// API endpoints for applicants
const express = require('express');
const router = express.Router();
const applicantService = require('../service/applicant.service');
const userService = require('../service/user.service');
const { multerPfpSingle } = require('../middleware/pfpUpload');
const { multerResumeSingle } = require('../middleware/resumeUpload');

const ROLE = 'applicant';

// GET: api/applicants/:id/pfp
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

// GET: api/applicants/:id/resume
router.get('/:id/resume', async (req, res) => {
  try {
    const { buffer, contentType } = await applicantService.getApplicantResume(req.params.id);
    const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer?.data ?? []);
    const inline = req.query.inline === '1' || req.query.inline === 'true';
    res.set('Content-Disposition', inline ? 'inline; filename="resume.pdf"' : 'attachment; filename="resume.pdf"');
    res.type(contentType).send(body);
  } catch (err) {
    if (err.message === 'Applicant not found') return res.status(404).end();
    res.status(500).end();
  }
});

// GET: api/applicants
router.get('/', async (req, res) => {
  try {
    const result = await applicantService.getAllApplicants();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// GET: api/applicants/:id
router.get('/:id', async (req, res) => {
  try {
    const applicant = await applicantService.getApplicantById(req.params.id);
    res.json(applicant);
  } catch (error) {
    if (error.message === 'Applicant not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch applicant' });
  }
});

// PUT: api/applicants/:id/pfp
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

// POST: api/applicants/:id/resume
router.post('/:id/resume', multerResumeSingle('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await applicantService.uploadApplicantResume(
      req.params.id, req.file.buffer, req.file.mimetype
    );
    res.json(result);
  } catch (error) {
    if (error.message === 'Applicant not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// POST: api/applicants/:id/delete
router.post('/:id/delete', async (req, res) => {
  try {
    await userService.deleteAccount(ROLE, req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
