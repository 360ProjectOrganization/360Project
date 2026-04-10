jest.mock('../service/company.service', () => ({
  getAllCompanies: jest.fn(),
  getCompanyById: jest.fn(),
}));

jest.mock('../service/user.service', () => ({
  getPfp: jest.fn(),
  updatePfp: jest.fn(),
  deleteAccount: jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const companyService = require('../service/company.service');
const companyRouter = require('../controller/company.controller');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/companies', companyRouter);
  return app;
}

describe('company.controller', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
  });

  it('GET / returns companies JSON from the service', async () => {
    const rows = [{ _id: 'c1', name: 'Acme' }];
    companyService.getAllCompanies.mockResolvedValue(rows);

    const res = await request(app).get('/api/companies');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(rows);
  });

  it('GET /:id returns 404 when company is not found', async () => {
    companyService.getCompanyById.mockRejectedValue(new Error('Company not found'));

    const res = await request(app).get('/api/companies/507f1f77bcf86cd799439011');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Company not found');
  });
});
