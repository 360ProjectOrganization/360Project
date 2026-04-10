jest.mock('../service/admin.service', () => ({
  getAllAdmins: jest.fn(),
  findAllAnalytics: jest.fn(),
  updateAdmin: jest.fn(),
}));

jest.mock('../service/user.service', () => ({
  getPfp: jest.fn(),
  updatePfp: jest.fn(),
  deleteAccount: jest.fn(),
  changeStatus: jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const adminService = require('../service/admin.service');
const adminRouter = require('../controller/admin.controller');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRouter);
  return app;
}

describe('admin.controller', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
  });

  it('GET / returns administrators from the service', async () => {
    const rows = [{ _id: 'a1', email: 'admin@test.com' }];
    adminService.getAllAdmins.mockResolvedValue(rows);

    const res = await request(app).get('/api/admin');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
  });

  it('GET /allJobPostingAnalytics returns analytics JSON', async () => {
    const payload = { numJobPostings: 3, numUsers: 10 };
    adminService.findAllAnalytics.mockResolvedValue(payload);

    const res = await request(app).get('/api/admin/allJobPostingAnalytics');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(payload);
  });
});
