// Database operations for job postings
const JobPosting = require('./models/jobPosting.model');
const Company = require('./models/company.model');
const Applicant = require('./models/applicant.model');

const jobPostingRepository = {
  async findAll(filters = {}, options = {}) {
    const { limit = 100, skip = 0, sort = { createdAt: -1 } } = options;
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.companyId) {
      const company = await Company.findById(filters.companyId).select('jobPostings').lean();
      if (!company || !company.jobPostings?.length) return [];
      query._id = { $in: company.jobPostings };
    }
    return await JobPosting.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean();
  },

  async findById(id) {
    return await JobPosting.findById(id).lean();
  },

  async findCompanyIdByJobId(jobId) {
    const company = await Company.findOne({ jobPostings: jobId }).select('_id').lean();
    return company ? company._id.toString() : null;
  },

  async update(id, data) {
    const setUpdate = { ...data };
    if (data.status === 'ACTIVE') setUpdate.publishedAt = new Date();
    if (data.status === 'CLOSED') setUpdate.closedAt = new Date();
    const update = { $set: setUpdate };
    if (data.status === 'ACTIVE' || data.status === 'UNPUBLISHED') {
      update.$unset = { closureReason: 1, closedAt: 1 };
    }
    const job = await JobPosting.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).lean();
    return job;
  },

  async updateStatus(id, status, closureReason) {
    const setUpdate = { status };
    if (status === 'ACTIVE') setUpdate.publishedAt = new Date();
    if (status === 'CLOSED') {
      setUpdate.closedAt = new Date();
      setUpdate.closureReason = closureReason;
    }
    const update = { $set: setUpdate };
    if (status === 'ACTIVE' || status === 'UNPUBLISHED') {
      update.$unset = { closureReason: 1, closedAt: 1 };
    }
    const job = await JobPosting.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).lean();
    return job;
  },

  async delete(id) {
    console.log("start delete")
    await Company.updateOne({ jobPostings: id }, { $pull: { jobPostings: id } });
    console.log("Upaded company")
    const deleted = await JobPosting.findByIdAndDelete(id);
    if (!deleted) return null;
    console.log("deleted")
    await Applicant.updateMany({ jobsAppliedTo: { job: id } }, { $pull: { jobsAppliedTo: { job: id } } });
    console.log("Updated many")
    return deleted;
  },

  async addApplicantToJob(jobId, applicantId) {
    const date = new Date();
    const job = await JobPosting.findById(jobId).lean();
    if (!job) return null;
    const alreadyApplied = (job.applicants || []).some((id) => id.toString() === String(applicantId));
    if (alreadyApplied) return { job, alreadyApplied: true };
    await JobPosting.findByIdAndUpdate(jobId, { $addToSet: { applicants: applicantId } });
    await Applicant.findByIdAndUpdate(applicantId, { $addToSet: { jobsAppliedTo: { job: jobId, appliedAt: date } } });
    return { job: await JobPosting.findById(jobId).lean(), alreadyApplied: false };
  },

  async findRecentApplicationsByJobId(jobId, limit = 50) {
    const job = await JobPosting.findById(jobId).select('applicants').lean();
    if (!job || !job.applicants?.length) return [];
    const recentIds = job.applicants.slice(-limit).reverse();
    const applicants = await Applicant.find({ _id: { $in: recentIds } })
      .select('name email createdAt')
      .lean();
    const byId = Object.fromEntries(applicants.map((a) => [a._id.toString(), a]));
    return recentIds.map((id) => byId[id.toString()]).filter(Boolean);
  },
  
  async addCommentToJob(jobId, data) {
    const job = await JobPosting.findById(jobId).lean();
    if (!job) return null;
    const comment = await JobPosting.findByIdAndUpdate(jobId, { $push: { comments: data } }, { new: true }).lean();
    return comment;
  },
  
  async updateComment(jobId, commentId, data) {
    const job = await JobPosting.findById(jobId).lean();
    if (!job) return null;
    const update = {
      'comments.$[comment].content': data.content,
      'comments.$[comment].editedAt': new Date(),
    };
    const updated = await JobPosting.findByIdAndUpdate(
      jobId,
      { $set: update },
      { new: true, arrayFilters: [{ 'comment._id': commentId }] }
    ).lean();
    return updated;
  },
  
  async deleteComment(jobId, commentId) {
    const job = await JobPosting.findById(jobId).lean();
    if (!job) return null;
    const comment = await JobPosting.findByIdAndUpdate(jobId, { $pull: { comments: { _id: commentId } } }, { new: true }).lean();
    return comment;
  },
  
  async findCommentsByJobId(jobId) {
    const job = await JobPosting.findById(jobId).select('comments').lean();
    if (!job || !job.comments?.length) return [];
    return job.comments;
  },
  
  async findCommentsByUserId(userId) {
    const jobs = await JobPosting.find(
      { 'comments.authorId': userId },
      { comments: 1, title: 1 }
    ).lean();

    if (!jobs) return null;

    const comments = jobs.flatMap((job) =>
      (job.comments || [])
        .filter((comment) => comment.authorId?.toString() === String(userId))
        .map((comment) => ({
          ...comment,
          jobId: job._id,
          jobTitle: job.title,
        }))
    );

    return comments.sort((a, b) => {
      const aTime = new Date(a.editedAt || a.createdAt);
      const bTime = new Date(b.editedAt || b.createdAt);
      return bTime - aTime;
    });
  },
};

module.exports = jobPostingRepository;
