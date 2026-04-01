const adminRepository = require('../repository/admin.repository');

class AdminService {
  async getAllAdmins() {
    return await adminRepository.findAll();
  }
  async findAllAnalytics() {
    const analytics = {numJobPostings: await adminRepository.countJobPostings()};
    const unfilledJobs = await adminRepository.countUnfilledJobPostings();
    const filledJobs = await adminRepository.countFilledJobPostings();
    const jobFillRate = unfilledJobs + filledJobs > 0 ? Math.round((filledJobs / (unfilledJobs + filledJobs)) * 1000) / 10 : 0;
    const numAdmins = await adminRepository.countAdmins();
    const numApplicants = await adminRepository.countAplicants();
    const numCompanies = await adminRepository.countCompanies();
    const numUsers = numAdmins + numApplicants + numCompanies;
    analytics.numUsers = numUsers;
    analytics.jobFillRate = jobFillRate;
    return analytics;
  }

}

module.exports = new AdminService();