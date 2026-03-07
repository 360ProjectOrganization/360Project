// Business logic for job postings
const jobPostingRepository = require('../repository/jobPosting.repository');
const applicantRepository = require('../repository/applicant.repository');
const JobPosting = require('../repository/models/jobPosting.model');

const STATUSES = JobPosting.STATUSES || ['ACTIVE', 'UNPUBLISHED', 'CLOSED'];

function validateStatus(status) {
  if (!status || !STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${STATUSES.join(', ')}`);
  }
}

function validateJobPayload(data, isPartial = false) {
  const { title, tags, location, description, status } = data;
  if (!isPartial && (!title || typeof title !== 'string' || !title.trim())) {
    throw new Error('Title is required');
  }
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    throw new Error('Title must be a non-empty string');
  }
  if (tags !== undefined && !Array.isArray(tags)) {
    throw new Error('Tags must be an array');
  }
  if (status !== undefined) validateStatus(status);
  return true;
}

class JobPostingService {
  async getJobPostings(filters = {}, options = {}) {
    return await jobPostingRepository.findAll(filters, options);
  }

  async getJobPostingById(id) {
    const job = await jobPostingRepository.findById(id);
    if (!job) throw new Error('Job posting not found');
    return job;
  }

  async updateJobPosting(id, data) {
    const job = await jobPostingRepository.findById(id);
    if (!job) throw new Error('Job posting not found');
    validateJobPayload(data, true);
    const update = {};
    if (data.title !== undefined) update.title = data.title.trim();
    if (data.tags !== undefined) update.tags = data.tags.map((t) => String(t).trim()).filter(Boolean);
    if (data.location !== undefined) update.location = String(data.location).trim();
    if (data.description !== undefined) update.description = String(data.description).trim();
    if (data.status !== undefined) {
      validateStatus(data.status);
      update.status = data.status;
    }
    return await jobPostingRepository.update(id, update);
  }

  async updateJobPostingStatus(id, status) {
    validateStatus(status);
    const job = await jobPostingRepository.findById(id);
    if (!job) throw new Error('Job posting not found');
    return await jobPostingRepository.updateStatus(id, status);
  }

  async deleteJobPosting(id) {
    const deleted = await jobPostingRepository.delete(id);
    if (!deleted) throw new Error('Job posting not found');
    return deleted;
  }

  async getRecentApplications(jobId, limit = 50) {
    const job = await jobPostingRepository.findById(jobId);
    if (!job) throw new Error('Job posting not found');
    return await jobPostingRepository.findRecentApplicationsByJobId(jobId, limit);
  }

  async ensureCompanyOwnsJob(jobId, companyId) {
    const ownerId = await jobPostingRepository.findCompanyIdByJobId(jobId);
    if (!ownerId || ownerId !== companyId) {
      throw new Error('Job posting not found or access denied');
    }
  }

  async applyToJob(jobId, applicantId) {
    const job = await jobPostingRepository.findById(jobId);
    if (!job) throw new Error('Job posting not found');
    if (job.status !== 'ACTIVE') {
      throw new Error('You can only apply to active job postings');
    }
    const hasResume = await applicantRepository.hasResume(applicantId);
    if (!hasResume) {
      throw new Error('Resume required to apply. Please upload a resume to your profile first.');
    }
    const result = await jobPostingRepository.addApplicantToJob(jobId, applicantId);
    if (result.alreadyApplied) {
      throw new Error('You have already applied to this job');
    }
    return result.job;
  }
}

module.exports = new JobPostingService();
