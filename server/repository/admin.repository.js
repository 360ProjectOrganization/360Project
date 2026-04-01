const Admin = require('./models/administrator.model');
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
}
module.exports = adminRepository;