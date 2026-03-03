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

  async getApplicantResume(id) {
    const doc = await applicantRepository.findByIdForResume(id);
    if (!doc || !doc.resume || !doc.resume.length) throw new Error('Applicant not found');
    return { buffer: doc.resume, contentType: doc.resumeContentType || 'application/pdf' };
  }

  async uploadApplicantResume(id, buffer, contentType) {
    const applicant = await applicantRepository.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    return await applicantRepository.updateResume(id, buffer, contentType);
  }
}

module.exports = new ApplicantService();
