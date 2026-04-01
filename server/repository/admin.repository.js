const Admin = require('./models/administrator.model');
const JobPosting = require('../repository/models/jobPosting.model');
const Applicant = require('../repository/models/applicant.model');
const Company = require('./models/company.model');
const adminRepository = {
    async findAll(filter = {}, options = {}) {
        const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
        return await Admin.find(filter)
          .select('-password -pfp')
          .limit(limit)
          .skip(skip)
          .sort(sort)
          .lean();
      },
      async countAdmins() {
        return await Admin.countDocuments();
      },
      async countAplicants(){
        return await Applicant.countDocuments();
      },
      async countCompanies(){
        return await Company.countDocuments();
      },
      async countUnfilledJobPostings() {
        return await JobPosting.countDocuments({status: 'CLOSED', closureReason: 'UNFILLED'});
      },
      async countFilledJobPostings() {
        return await JobPosting.countDocuments({status: 'CLOSED', closureReason: 'FILLED'});
      },
      async countJobPostings(){
        return await JobPosting.countDocuments();
      },
}
module.exports = adminRepository;