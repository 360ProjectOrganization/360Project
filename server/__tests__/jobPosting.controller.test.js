jest.mock('../service/jobPosting.service', () => ({
  getJobPostings: jest.fn(),
  findCommentsByJobId: jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const jobPostingService = require('../service/jobPosting.service');
const jobPostingRouter = require('../controller/jobPosting.controller');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/job-postings', jobPostingRouter);
  return app;
}

describe('jobPosting.controller', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
  });

  it('GET / returns job postings from the service', async () => {
    const jobs = [{ _id: 'j1', title: 'Engineer' }];
    jobPostingService.getJobPostings.mockResolvedValue(jobs);

    const res = await request(app).get('/api/job-postings');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(jobs);
  });

  it('GET /:id/comments returns 404 when comments cannot be loaded', async () => {
    jobPostingService.findCommentsByJobId.mockRejectedValue(new Error('Failed to retrieve comments'));

    const res = await request(app).get('/api/job-postings/507f1f77bcf86cd799439011/comments');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Job posting not found');
  });
});
