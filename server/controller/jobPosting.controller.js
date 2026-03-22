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

// GET: api/job-postings/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await jobPostingService.findCommentsByJobId(req.params.id);
    res.json(comments);
  } catch (err) {
    if (err.message === 'Failed to retrieve comments') {
      return sendError(res, 404, 'Job posting not found');
    }
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST: api/job-postings/:id/comments
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const job = await jobPostingService.addCommentToJob(req.params.id, content, req.user.id, req.user.role);
    res.status(201).json(job);
  } catch (err) {
    if (err.message === 'Failed to add comment' || err.message === 'Comment is empty' || err.message === 'Invalid user role') {
      return sendError(res, 400, err.message);
    }
    if (err.message === 'Companies can only comment on their own job postings') {
      return sendError(res, 403, err.message);
    }
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// PATCH: api/job-postings/:id/comments/:commentId
router.patch('/:id/comments/:commentId', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const job = await jobPostingService.updateComment(req.params.id, req.params.commentId, content, req.user.id, req.user.role);
    res.json(job);
  } catch (err) {
    if (err.message === 'Comment not found') {
      return sendError(res, 404, err.message);
    }
    if (err.message === 'Comment is empty') {
      return sendError(res, 400, err.message);
    }
    if (err.message === 'You can only edit your own comments') {
      return sendError(res, 403, err.message);
    }
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE: api/job-postings/:id/comments/:commentId
router.delete('/:id/comments/:commentId', requireAuth, async (req, res) => {
  try {
    await jobPostingService.deleteComment(req.params.id, req.params.commentId, req.user.id, req.user.role);
    res.json({ deleted: true });
  } catch (err) {
    if (err.message === 'Comment not found') {
      return sendError(res, 404, err.message);
    }
    if (err.message === 'You can only delete your own comments') {
      return sendError(res, 403, err.message);
    }
    res.status(500).json({ error: 'Failed to delete comment' });
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
