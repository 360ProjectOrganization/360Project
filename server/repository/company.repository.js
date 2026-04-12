// Database operations for companies
const Company = require('./models/company.model');
const JobPosting = require('./models/jobPosting.model');

const companyRepository = {
  async findAll(options = {}) {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
    return await Company.find({})
      .select('-password -pfp')
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean();
  },

  async findById(id) {
    return await Company.findById(id).select('-password -pfp').lean();
  },

  async findJobPostingsByCompanyId(companyId) {
    const company = await Company.findById(companyId).select('jobPostings').lean();
    if (!company || !company.jobPostings?.length) {
      return [];
    }
    return await JobPosting.find({ _id: { $in: company.jobPostings } })
      .lean();
  },

  async findAnalyticsByCompanyId(companyId) {
    const company = await Company.findById(companyId).select('jobPostings').lean();
    if (!company || !company.jobPostings?.length) {
      return { totalJobs: 0, closedJobs: 0, filledCount: 0, unfilledCount: 0, avgPostingDurationDays: 0, fillRate: 0 };
    }

    const jobs = await JobPosting.find({ _id: { $in: company.jobPostings } })
      .select('status closureReason publishedAt closedAt')
      .lean();

    const now = new Date();
    const published = jobs.filter((j) => j.publishedAt);
    const closed = jobs.filter((j) => j.status === 'CLOSED');
    const filled = closed.filter((j) => j.closureReason === 'FILLED');
    const unfilled = closed.filter((j) => j.closureReason === 'UNFILLED');
    const meaningful = filled.length + unfilled.length;

    let totalDurationMs = 0;
    let durationCount = 0;
    for (const job of published) {
      const end = job.closedAt ? new Date(job.closedAt) : now;
      totalDurationMs += end.getTime() - new Date(job.publishedAt).getTime();
      durationCount++;
    }

    const avgPostingDurationDays = durationCount > 0
      ? Math.round((totalDurationMs / durationCount) / (1000 * 60 * 60 * 24) * 10) / 10
      : 0;

    const fillRate = meaningful > 0
      ? Math.round((filled.length / meaningful) * 1000) / 10
      : 0;

    return {
      totalJobs: jobs.length,
      closedJobs: closed.length,
      filledCount: filled.length,
      unfilledCount: unfilled.length,
      avgPostingDurationDays,
      fillRate,
    };
  },

  async createJobPostingForCompany(companyId, jobData) {
    const company = await Company.findById(companyId);
    if (!company) return null;

    const job = await JobPosting.create({
      title: jobData.title,
      location: jobData.location ?? '',
      description: jobData.description ?? '',
      tags: jobData.tags ?? [],
      status: 'ACTIVE',
      publishedAt: new Date(),
      author: companyId
    });

    company.jobPostings.push(job._id);
    await company.save();

    return job.toObject ? job.toObject() : job;
  },
};

module.exports = companyRepository;
