// business logic for applicants
const applicantRepository = require('../repository/applicant.repository');

class ApplicantService {
  async getAllApplicants() {
    return await applicantRepository.findAll();
  }

  async getApplicantById(id) {
    const applicant = await applicantRepository.findById(id);
    if (!applicant) {
      throw new Error('Applicant not found');
    }
    return applicant;
  }

  // TODO:
  // register
  // update profile or resume
  // delete account
  // apply to job
  // view applied jobs
}

module.exports = new ApplicantService();
