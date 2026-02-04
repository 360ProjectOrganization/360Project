// Database operations for applicants
const Applicant = require('./models/applicant.model');

const applicantRepository = {
  async findAll(filter = {}, options = {}) {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
    return await Applicant.find(filter)
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean();
  },

  async findById(id) {
    return await Applicant.findById(id).select('-password').lean();
  },

  // TODO:
  // create
  // update
  // delete
  // view applied jobs
};

module.exports = applicantRepository;
