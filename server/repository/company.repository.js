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
};

module.exports = companyRepository;
