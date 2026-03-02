// API endpoints for companies
const express = require('express');
const router = express.Router();
const companyService = require('../service/company.service');

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
