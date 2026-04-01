const adminRepository = require('../repository/admin.repository');
const authRepository = require('../repository/auth.repository');
const ROLES = ['applicant', 'company', 'administrator'];
const SENSITIVE_KEYS = ['password', 'pfp', 'resume', 'pfpContentType', 'resumeContentType'];


function toSafeUser(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  SENSITIVE_KEYS.forEach((key) => delete obj[key]);
  return obj;
}

function validateRole(role) {
  const r = (role || '').toLowerCase();
  if (!ROLES.includes(r)) {
    throw new Error('Invalid role. Must be applicant, company, or administrator.');
  }
  return r;
}

function validateEmail(email) {
  const e = (email || '').trim();
  if (!e) throw new Error('Email is required.');
  return e;
}

function validatePassword(password, fieldName = 'Password') {
  if (!password || typeof password !== 'string') {
    throw new Error(`${fieldName} is required.`);
  }
  if (password.length < 8) {
    throw new Error(`${fieldName} must be at least 8 characters.`);
  }
}
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
  async updateAdmin(id, data){
    console.log(data);
    const r = validateRole(data.role);
    if (!id) throw new Error('User id is required.');
    const emailNorm = validateEmail(data.email);
    const doc = await authRepository.findDocumentById(id, r);
    if (!doc) throw new Error('User not found.');
    if (doc.email !== emailNorm) { doc.email = emailNorm; }
    if (doc.name !== data.name.trim()) { doc.name = data.name.trim(); }
    if (data.password !=="" && ! await doc.comparePassword(data.password)) { 
      validatePassword(data.password, 'New password');
      doc.password = data.password; }
    await doc.save();
    return toSafeUser(doc);
  }
}
module.exports = new AdminService();