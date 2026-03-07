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

  async findByIdForResume(id) {
    return await Applicant.findById(id).select('resume resumeContentType');
  },

  async hasResume(id) {
    const doc = await Applicant.findById(id).select('resume').lean();
    return doc != null && doc.resume != null && Buffer.isBuffer(doc.resume) && doc.resume.length > 0;
  },

  async updateResume(id, buffer, contentType) {
    return await Applicant.findByIdAndUpdate(
      id,
      { resume: buffer, resumeContentType: contentType || 'application/pdf' },
      { new: true }
    ).select('-password -pfp -resume').lean();
  },
};

module.exports = applicantRepository;
