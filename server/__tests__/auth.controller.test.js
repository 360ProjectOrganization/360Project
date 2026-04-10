jest.mock('../service/auth.service', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const authService = require('../service/auth.service');
const authRouter = require('../controller/auth.controller');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
}

describe('auth.controller', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
  });

  it('POST /register returns 400 when service rejects with invalid role', async () => {
    authService.register.mockRejectedValue(
      new Error('Invalid role. Must be applicant, company, or administrator.')
    );

    const res = await request(app)
      .post('/api/auth/register')
      .send({ role: 'bad', email: 'a@b.com', password: 'password1', name: 'X' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid role/i);
  });

  it('POST /login returns 401 when credentials are invalid', async () => {
    authService.login.mockRejectedValue(new Error('Invalid email or password.'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'password1', role: 'applicant' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Invalid email or password/i);
  });
});
