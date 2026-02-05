// API endpoints for applicants
const express = require('express');
const router = express.Router();
const applicantService = require('../service/applicant.service');

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

// TODO:
// register
// update profile or resume
// delete account
// apply to job
// view applied jobs

module.exports = router;
