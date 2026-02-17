// Database operations for applicants
const Applicant = require('./models/applicant.model');

const applicantRepository = {
  async findAll(filter = {}, options = {}) {
    const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
    return await Applicant.find(filter)
      .select('-password -pfp -resume')
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean();
  },

  async findById(id) {
    return await Applicant.findById(id).select('-password -pfp -resume').lean();
  },

  async deleteById(id) {
    const result = await Applicant.findByIdAndDelete(id);
    return result != null;
  },

  async findByIdForAsset(id, field) {
    const key = field === 'pfp' ? 'pfp pfpContentType' : 'resume resumeContentType';
    return await Applicant.findById(id).select(key);
  },

  async updateAsset(id, field, buffer, contentType) {
    const update = field === 'pfp'
      ? { pfp: buffer, pfpContentType: contentType || 'image/jpeg' }
      : { resume: buffer, resumeContentType: contentType || 'application/pdf' };
    return await Applicant.findByIdAndUpdate(id, update, { new: true })
      .select('-password -pfp -resume').lean();
  },

  // TODO:
  // create
  // update
  // delete
  // view applied jobs
};

module.exports = applicantRepository;
