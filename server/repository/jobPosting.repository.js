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
    const update = { ...data };
    if (data.status === 'ACTIVE') update.publishedAt = new Date();
    if (data.status === 'CLOSED') update.closedAt = new Date();
    const job = await JobPosting.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    return job;
  },

  async updateStatus(id, status) {
    const update = { status };
    if (status === 'ACTIVE') update.publishedAt = new Date();
    if (status === 'CLOSED') update.closedAt = new Date();
    const job = await JobPosting.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    return job;
  },

  async delete(id) {
    await Company.updateOne({ jobPostings: id }, { $pull: { jobPostings: id } });
    const deleted = await JobPosting.findByIdAndDelete(id);
    if (!deleted) return null;
    await Applicant.updateMany({ jobsAppliedTo: id }, { $pull: { jobsAppliedTo: id } });
    return deleted;
  },

  async addApplicantToJob(jobId, applicantId) {
    const job = await JobPosting.findById(jobId).lean();
    if (!job) return null;
    const alreadyApplied = (job.applicants || []).some((id) => id.toString() === String(applicantId));
    if (alreadyApplied) return { job, alreadyApplied: true };
    await JobPosting.findByIdAndUpdate(jobId, { $addToSet: { applicants: applicantId } });
    await Applicant.findByIdAndUpdate(applicantId, { $addToSet: { jobsAppliedTo: jobId } });
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
};

module.exports = jobPostingRepository;
