const express = require('express');
const router = express.Router();
const jobPostingService = require('../service/jobPosting.service');
const { requireAuth } = require('../middleware/auth.middleware');

function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

// GET: api/job-postings
router.get('/', async (req, res) => {
  try {
    const jobs = await jobPostingService.getJobPostings();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
});

// GET: api/job-postings/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await jobPostingService.getJobPostingById(req.params.id);
    res.json(job);
  } catch (err) {
    if (err.message === 'Job posting not found') {
      return sendError(res, 404, err.message);
    }
    res.status(500).json({ error: 'Failed to fetch job posting' });
  }
});

// POST: api/job-postings/:id/apply
router.post('/:id/apply', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'applicant') {
      return sendError(res, 403, 'Only applicants can apply to jobs');
    }
    const job = await jobPostingService.applyToJob(req.params.id, req.user.id);
    res.status(201).json({ applied: true, job });
  } catch (err) {// API endpoints for job postings

    if (err.message === 'Job posting not found') {
      return sendError(res, 404, err.message);
    }
    if (err.message === 'You can only apply to active job postings' || err.message === 'Resume required to apply. Please upload a resume to your profile first.' || err.message === 'You have already applied to this job') {
      return sendError(res, 400, err.message);
    }
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

function canModifyJob(req) {
  return req.user.role === 'company' || req.user.role === 'administrator';
}

// PUT: api/job-postings/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    if (!canModifyJob(req)) {
      return sendError(res, 403, 'Only the company that owns this job or an administrator can update it');
    }
    if (req.user.role === 'company') {
      await jobPostingService.ensureCompanyOwnsJob(req.params.id, req.user.id);
    }
    const job = await jobPostingService.updateJobPosting(req.params.id, req.body);
    res.json(job);
  } catch (err) {
    if (err.message === 'Job posting not found' || err.message === 'Job posting not found or access denied') {
      return sendError(res, 404, err.message);
    }
    if (err.message?.includes('Invalid status') || err.message?.includes('required') || err.message?.includes('must be')) {
      return sendError(res, 400, err.message);
    }
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

// PATCH: api/job-postings/:id/status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    if (!canModifyJob(req)) {
      return sendError(res, 403, 'Only the company that owns this job or an administrator can change its status');
    }
    if (req.user.role === 'company') {
      await jobPostingService.ensureCompanyOwnsJob(req.params.id, req.user.id);
    }
    const { status } = req.body;
    const job = await jobPostingService.updateJobPostingStatus(req.params.id, status);
    res.json(job);
  } catch (err) {
    if (err.message === 'Job posting not found' || err.message === 'Job posting not found or access denied') {
      return sendError(res, 404, err.message);
    }
    if (err.message?.includes('Invalid status')) {
      return sendError(res, 400, err.message);
    }
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// DELETE: api/job-postings/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (!canModifyJob(req)) {
      return sendError(res, 403, 'Only the company that owns this job or an administrator can delete it');
    }
    if (req.user.role === 'company') {
      await jobPostingService.ensureCompanyOwnsJob(req.params.id, req.user.id);
    }
    await jobPostingService.deleteJobPosting(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    if (err.message === 'Job posting not found' || err.message === 'Job posting not found or access denied') {
      return sendError(res, 404, err.message);
    }
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

// GET: api/job-postings/:id/applications
router.get('/:id/applications', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'company') {
      return sendError(res, 403, 'Only the company that owns this job can view applications');
    }
    await jobPostingService.ensureCompanyOwnsJob(req.params.id, req.user.id);
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const applications = await jobPostingService.getRecentApplications(req.params.id, limit);
    res.json(applications);
  } catch (err) {
    if (err.message === 'Job posting not found' || err.message === 'Job posting not found or access denied') {
      return sendError(res, 404, err.message);
    }
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

module.exports = router;
