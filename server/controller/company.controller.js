// API endpoints for companies
const express = require('express');
const router = express.Router();
const companyService = require('../service/company.service');
const userService = require('../service/user.service');
const multer = require('multer');

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
const ROLE = 'company';

// GET: api/companies
router.get('/', async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET: api/companies/:id/job-postings
router.get('/:id/job-postings', async (req, res) => {
  try {
    const jobPostings = await companyService.getCompanyJobPostings(req.params.id);
    res.json(jobPostings);
  } catch (error) {
    if (error.message === 'Company not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
});

// GET: api/companies/:id/analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const analytics = await companyService.getCompanyAnalytics(req.params.id);
    res.json(analytics);
  } catch (error) {
    if (error.message === 'Company not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch company analytics' });
  }
});

// GET: api/companies/:id/pfp
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

// PUT: api/companies/:id/pfp
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

// POST: api/companies/:id/delete
router.post('/:id/delete', async (req, res) => {
  try {
    await userService.deleteAccount(ROLE, req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// GET: api/companies/:id
router.get('/:id', async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.json(company);
  } catch (error) {
    if (error.message === 'Company not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

module.exports = router;
