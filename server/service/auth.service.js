const jwt = require('jsonwebtoken');
const authRepository = require('../repository/auth.repository');

const ROLES = ['applicant', 'company', 'administrator'];
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// turn a user object into a safe object by removing sensitive data

const SENSITIVE_KEYS = ['password', 'pfp', 'resume', 'pfpContentType', 'resumeContentType'];

function toSafeUser(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  SENSITIVE_KEYS.forEach((key) => delete obj[key]);
  return obj;
}

// helpers

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

function issueToken(doc, role) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT is not configured.');
  return jwt.sign(
    {
      id: doc._id.toString(),
      role,
      email: doc.email,
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

class AuthService {
  async register(role, data) {
    const r = validateRole(role);
    const email = validateEmail(data.email);
    validatePassword(data.password, 'Password');

    if (await authRepository.isEmailTaken(email, r)) {
      throw new Error('An account with this email already exists.');
    }

    if (r === 'applicant') {
      const name = (data.name || '').trim();
      if (!name) throw new Error('Name is required for applicants.');
      const doc = await authRepository.createApplicant({ email, name, password: data.password });
      const token = issueToken(doc, r);
      return { user: toSafeUser(doc), token };
    }

    if (r === 'company') {
      const name = (data.name || '').trim();
      if (!name) throw new Error('Company name is required.');
      const doc = await authRepository.createCompany({ name, email, password: data.password });
      const token = issueToken(doc, r);
      return { user: toSafeUser(doc), token };
    }

    if (r === 'administrator') {
      const doc = await authRepository.createAdministrator({ email, password: data.password });
      const token = issueToken(doc, r);
      return { user: toSafeUser(doc), token };
    }

    throw new Error('Invalid role.');
  }

  async login(email, password, role) {
    const r = validateRole(role);
    const emailNorm = validateEmail(email);
    if (!password) throw new Error('Password is required.');

    const doc = await authRepository.findDocumentByEmailAndRole(emailNorm, r);
    if (!doc) {
      if (process.env.NODE_ENV !== 'production') console.log('[auth] user not found:', emailNorm, 'role:', r);
      throw new Error('Invalid email or password.');
    }

    const match = await doc.comparePassword(password);
    if (!match) {
      if (process.env.NODE_ENV !== 'production') console.log('[auth] password mismatch for:', emailNorm);
      throw new Error('Invalid email or password.');
    }

    const token = issueToken(doc, r);
    return { user: toSafeUser(doc), token };
  }

  async changePassword(id, role, currentPassword, newPassword) {
    const r = validateRole(role);
    if (!id) throw new Error('User id is required.');
    if (!currentPassword) throw new Error('Current password is required.');
    validatePassword(newPassword, 'New password');

    const doc = await authRepository.findDocumentById(id, r);
    if (!doc) throw new Error('User not found.');

    const match = await doc.comparePassword(currentPassword);
    if (!match) throw new Error('Current password is incorrect.');

    doc.password = newPassword;
    await doc.save();
    return toSafeUser(doc);
  }

  async changeEmail(id, role, newEmail, password) {
    const r = validateRole(role);
    if (!id) throw new Error('User id is required.');
    const emailNorm = validateEmail(newEmail);
    if (!password) throw new Error('Password is required to change email.');

    const doc = await authRepository.findDocumentById(id, r);
    if (!doc) throw new Error('User not found.');

    const match = await doc.comparePassword(password);
    if (!match) throw new Error('Password is incorrect.');

    if (await authRepository.isEmailTaken(emailNorm, r, id)) {
      throw new Error('That email is already in use.');
    }

    doc.email = emailNorm;
    await doc.save();
    return toSafeUser(doc);
  }
}
module.exports = new AuthService();
