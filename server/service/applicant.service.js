// business logic for applicants
const applicantRepository = require('../repository/applicant.repository');
const fs = require('fs');
const path = require('path');

const MOCKFILES_DIR = path.join(__dirname, '../repository/models/mockfiles');

function readDefaultPfp() {
  const file = path.join(MOCKFILES_DIR, 'default_pfp.jpg');
  if (!fs.existsSync(file)) return null;
  return { buffer: fs.readFileSync(file), contentType: 'image/jpeg' };
}

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

  async getApplicantPfp(id) {
    const doc = await applicantRepository.findByIdForAsset(id, 'pfp');
    if (!doc) throw new Error('Applicant not found');
    if (doc.pfp && doc.pfp.length) {
      return { buffer: doc.pfp, contentType: doc.pfpContentType || 'image/jpeg' };
    }
    const fallback = readDefaultPfp();
    if (fallback) return fallback;
    throw new Error('Applicant not found');
  }

  async getApplicantResume(id) {
    const doc = await applicantRepository.findByIdForAsset(id, 'resume');
    if (!doc || !doc.resume || !doc.resume.length) throw new Error('Applicant not found');
    return { buffer: doc.resume, contentType: doc.resumeContentType || 'application/pdf' };
  }

  async updateApplicantPfp(id, buffer, contentType) {
    const applicant = await applicantRepository.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    return await applicantRepository.updateAsset(id, 'pfp', buffer, contentType);
  }

  async uploadApplicantResume(id, buffer, contentType) {
    const applicant = await applicantRepository.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    return await applicantRepository.updateAsset(id, 'resume', buffer, contentType);
  }

  // TODO:
  // register
  // delete account
  // apply to job
  // view applied jobs
}

module.exports = new ApplicantService();
