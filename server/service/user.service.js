// business logic for all user roles
const userRepository = require('../repository/user.repository');
const fs = require('fs');
const path = require('path');

const MOCKFILES_DIR = path.join(__dirname, '../repository/models/mockfiles');

function readDefaultPfp() {
  const file = path.join(MOCKFILES_DIR, 'default_pfp.jpg');
  if (!fs.existsSync(file)) return null;
  return { buffer: fs.readFileSync(file), contentType: 'image/jpeg' };
}

class UserService {
  async getPfp(role, id) {
    const doc = await userRepository.findByIdForPfp(role, id);
    if (!doc) throw new Error('User not found');
    if (doc.pfp && doc.pfp.length) {
      return { buffer: doc.pfp, contentType: doc.pfpContentType || 'image/jpeg' };
    }
    const fallback = readDefaultPfp();
    if (fallback) return fallback;
    throw new Error('No profile picture');
  }

  async updatePfp(role, id, buffer, contentType) {
    const exists = await userRepository.findById(role, id);
    if (!exists) throw new Error('User not found');
    return await userRepository.updatePfp(role, id, buffer, contentType);
  }

  async deleteAccount(role, id) {
    const exists = await userRepository.findById(role, id);
    if (!exists) throw new Error('User not found');
    const deleted = await userRepository.deleteById(role, id);
    if (!deleted) throw new Error('User not found');
    return { deleted: true };
  }
}

module.exports = new UserService();
