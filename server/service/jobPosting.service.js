// Business logic for job postings
const jobPostingRepository = require('../repository/jobPosting.repository');
const applicantRepository = require('../repository/applicant.repository');
const userRepository = require('../repository/user.repository');
const JobPosting = require('../repository/models/jobPosting.model');

const STATUSES = JobPosting.STATUSES || ['ACTIVE', 'UNPUBLISHED', 'CLOSED'];
const CLOSURE_REASONS = JobPosting.CLOSURE_REASONS || ['FILLED', 'UNFILLED', 'CANCELLED'];

function validateStatus(status) {
  if (!status || !STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${STATUSES.join(', ')}`);
  }
}

function validateClosureReason(reason) {
  if (!reason || !CLOSURE_REASONS.includes(reason)) {
    throw new Error(`Closure reason is required when closing. Must be one of: ${CLOSURE_REASONS.join(', ')}`);
  }
}

function validateJobPayload(data, isPartial = false) {
  const { title, tags, location, description, status, closureReason } = data;
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
  if (status === 'CLOSED') validateClosureReason(closureReason);
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
      if (data.status === 'CLOSED') {
        validateClosureReason(data.closureReason);
        update.closureReason = data.closureReason;
      }
    }
    return await jobPostingRepository.update(id, update);
  }

  async updateJobPostingStatus(id, status, closureReason) {
    validateStatus(status);
    if (status === 'CLOSED') validateClosureReason(closureReason);
    const job = await jobPostingRepository.findById(id);
    if (!job) throw new Error('Job posting not found');
    return await jobPostingRepository.updateStatus(id, status, status === 'CLOSED' ? closureReason : undefined);
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

  async addCommentToJob(jobId, content, userId, userRole) {
    if (!content?.trim()) throw new Error('Comment is empty');
    const authorType = userRole?.toLowerCase();
    if (!['applicant', 'company', 'administrator'].includes(authorType)) throw new Error('Invalid user role');
    if (authorType === 'company') {
      const ownerId = await jobPostingRepository.findCompanyIdByJobId(jobId);
      if (!ownerId || ownerId !== String(userId)) {
        throw new Error('Companies can only comment on their own job postings');
      }
    }
    const author = authorType === 'administrator' ? 'JobLy Admin' : (await userRepository.findDisplayName(authorType, userId)) || 'Unknown';
    const commentData = { authorId: userId, author, content: content.trim() };
    const job = await jobPostingRepository.addCommentToJob(jobId, commentData);
    if (!job) throw new Error('Failed to add comment');
    return job;
  }

  async updateComment(jobId, commentId, content, userId, userRole) {
    if (!content?.trim()) throw new Error('Comment is empty');
    const job = await jobPostingRepository.findById(jobId);
    if (!job) throw new Error('Comment not found');
    const comment = (job.comments || []).find((c) => c._id?.toString() === String(commentId));
    if (!comment) throw new Error('Comment not found');
    const isAdmin = userRole?.toLowerCase() === 'administrator';
    const isOwner = comment.authorId?.toString() === String(userId);
    if (!isAdmin && !isOwner) throw new Error('You can only edit your own comments');
    const updated = await jobPostingRepository.updateComment(jobId, commentId, { content: content.trim() });
    if (!updated) throw new Error('Comment not found');
    return updated;
  }

  async deleteComment(jobId, commentId, userId, userRole) {
    const job = await jobPostingRepository.findById(jobId);
    if (!job) throw new Error('Comment not found');
    const comment = (job.comments || []).find((c) => c._id?.toString() === String(commentId));
    if (!comment) throw new Error('Comment not found');
    const isAdmin = userRole?.toLowerCase() === 'administrator';
    const isOwner = comment.authorId?.toString() === String(userId);
    if (!isAdmin && !isOwner) throw new Error('You can only delete your own comments');
    const deleted = await jobPostingRepository.deleteComment(jobId, commentId);
    if (!deleted) throw new Error('Comment not found');
    return deleted;
  }

  async findCommentsByJobId(jobId) {
    const comments = await jobPostingRepository.findCommentsByJobId(jobId);
    if (!comments) throw new Error('Failed to retrieve comments');
    const authorIds = [...new Set(comments.map((c) => c.authorId?.toString()).filter(Boolean))];
    const roleByAuthor = Object.fromEntries(
      await Promise.all(authorIds.map(async (id) => [id, await userRepository.findRoleById(id)]))
    );
    return comments.map((c) => ({
      ...c,
      authorRole: roleByAuthor[c.authorId?.toString()] ?? null,
    }));
  }
    
  async findCommentsByUserId(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const comments = await jobPostingRepository.findCommentsByUserId(userId);
    if (!comments) throw new Error('Failed to retrieve comments');
    
    const authorIds = [...new Set(comments.map((c) => c.authorId?.toString()).filter(Boolean))];
    const roleByAuthor = Object.fromEntries(
      await Promise.all(authorIds.map(async (id) => [id, await userRepository.findRoleById(id)]))
    );
    
    return comments.map((c) => ({
      ...c,
      authorRole: roleByAuthor[c.authorId?.toString()] ?? null,
    }));
  }
}

module.exports = new JobPostingService();
