// For shared database operations for all the user roles
const Applicant = require('./models/applicant.model');
const Company = require('./models/company.model');
const Administrator = require('./models/administrator.model');

const MODELS = {
  applicant: Applicant,
  company: Company,
  administrator: Administrator,
};

const userRepository = {
  getModel(role) {
    const model = MODELS[role];
    if (!model) throw new Error('Invalid role');
    return model;
  },

  async findById(role, id) {
    const Model = this.getModel(role);
    return await Model.findById(id).select('_id').lean();
  },

  async findDisplayName(role, id) {
    const Model = this.getModel(role);
    const doc = await Model.findById(id).select('name email').lean();
    if (!doc) return null;
    return doc.name || doc.email || 'Unknown';
  },

  async findByIdForPfp(role, id) {
    const Model = this.getModel(role);
    return await Model.findById(id).select('pfp pfpContentType');
  },

  async updatePfp(role, id, buffer, contentType) {
    const Model = this.getModel(role);
    return await Model.findByIdAndUpdate(
      id,
      { pfp: buffer, pfpContentType: contentType || 'image/jpeg' },
      { new: true }
    ).select('-password -pfp -resume -resumeContentType').lean();
  },

  async deleteById(role, id) {
    const Model = this.getModel(role);
    const result = await Model.findByIdAndDelete(id);
    return result != null;
  },
};

module.exports = userRepository;
