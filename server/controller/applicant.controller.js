// API endpoints for applicants
const express = require('express');
const router = express.Router();
const applicantService = require('../service/applicant.service');
const multer = require('multer');

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// GET: api/applicants/:id/pfp or api/applicants/:id/resume
router.get(/^\/([^/]+)\/(pfp|resume)$/, async (req, res, next) => {
  const match = req.path.match(/^\/([^/]+)\/(pfp|resume)$/);
  if (!match) return next();
  const [, id, asset] = match;
  try {
    const { buffer, contentType } = asset === 'resume'
      ? await applicantService.getApplicantResume(id)
      : await applicantService.getApplicantPfp(id);
    const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer?.data ?? []);
    if (asset === 'resume') {
      const inline = req.query.inline === '1' || req.query.inline === 'true';
      res.set('Content-Disposition', inline ? 'inline; filename="resume.pdf"' : 'attachment; filename="resume.pdf"');
    }
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
router.put('/:id/pfp', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await applicantService.updateApplicantPfp(
      req.params.id, req.file.buffer, req.file.mimetype
    );
    res.json(result);
  } catch (error) {
    if (error.message === 'Applicant not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

// POST: api/applicants/:id/resume
router.post('/:id/resume', upload.single('file'), async (req, res) => {
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


// TODO:
// register
// delete account

module.exports = router;
