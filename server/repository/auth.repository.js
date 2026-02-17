const Applicant = require('./models/applicant.model');
const Company = require('./models/company.model');
const Administrator = require('./models/administrator.model');

const MODELS = {
  applicant: Applicant,
  company: Company,
  administrator: Administrator,
};

const authRepository = {
  // find the model for a given role
  getModel(role) {
    const model = MODELS[role];
    if (!model) throw new Error('Invalid role');
    return model;
  },

  // find a user by email and role
  async findDocumentByEmailAndRole(email, role) {
    const Model = this.getModel(role);
    const normalized = String(email).trim().toLowerCase();
    return await Model.findOne({ email: normalized });
  },

  // find a user by id and role
  async findDocumentById(id, role) {
    const Model = this.getModel(role);
    return await Model.findById(id);
  },

  // check if an email is already used for a given role
  async isEmailTaken(email, role, excludeId = null) {
    const Model = this.getModel(role);
    const normalized = String(email).trim().toLowerCase();
    const query = { email: normalized };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query).select('_id').lean();
    return existing != null;
  },

  // create an applicant
  async createApplicant(data) {
    return await Applicant.create({
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      password: data.password,
    });
  },

  // create a company
  async createCompany(data) {
    return await Company.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
  },

  // create an administrator
  async createAdministrator(data) {
    return await Administrator.create({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
  },
};

module.exports = authRepository;
