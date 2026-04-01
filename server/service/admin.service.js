const adminRepository = require('../repository/admin.repository');

class AdminService {
  async getAllAdmins() {
    return await adminRepository.findAll();
  } 

}

module.exports = new AdminService();