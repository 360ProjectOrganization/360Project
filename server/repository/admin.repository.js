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
      async countAllJobPostingsCreateWithDateCreated(){
        // agration pipline to group job postings by dateCreated and count them (I think this should work lmao https://stackoverflow.com/questions/41157406/count-of-records-by-date-mongodb)
        const result = await JobPosting.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        return result.map(row => ({ date: row._id, count: row.count }));
              
      },
      async countAllAdminAccountsByDateCreated(){
         // agration pipline to group Admins by dateCreated and count them (I think this should work lmao https://stackoverflow.com/questions/41157406/count-of-records-by-date-mongodb)
        const adminCounts = await Admin.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        return adminCounts.map(row => ({ date: row._id, count: row.count }));
      },
      async countAllCompaniesAccountsByDateCreated(){
         // agration pipline to group Companies by dateCreated and count them (I think this should work lmao https://stackoverflow.com/questions/41157406/count-of-records-by-date-mongodb)
        const companyCounts = await Company.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        return companyCounts.map(row => ({ date: row._id, count: row.count }));
      },
      async countAllApplicantsAccountsByDateCreated(){
         // agration pipline to group Applicants by dateCreated and count them (I think this should work lmao https://stackoverflow.com/questions/41157406/count-of-records-by-date-mongodb)
        const applicantCounts = await Applicant.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        return applicantCounts.map(row => ({ date: row._id, count: row.count }));
      }
};
module.exports = adminRepository;