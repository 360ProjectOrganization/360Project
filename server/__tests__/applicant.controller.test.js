jest.mock('../service/applicant.service', () => ({
  getAllApplicants: jest.fn(),
  getApplicantById: jest.fn(),
  getApplicantResume: jest.fn(),
  uploadApplicantResume: jest.fn(),
}));

jest.mock('../service/user.service', () => ({
  getPfp: jest.fn(),
  updatePfp: jest.fn(),
  deleteAccount: jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const applicantService = require('../service/applicant.service');
const userService = require('../service/user.service');
const applicantRouter = require('../controller/applicant.controller');

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/applicants', applicantRouter);
  return app;
}

describe('applicant.controller', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
  });

  describe('GET /api/applicants', () => {
    it('returns JSON list from service', async () => {
      const rows = [{ _id: '1', email: 'a@b.com' }];
      applicantService.getAllApplicants.mockResolvedValue(rows);

      const res = await request(app).get('/api/applicants');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
    });

    it('returns 500 when service fails', async () => {
      applicantService.getAllApplicants.mockRejectedValue(new Error('db'));

      const res = await request(app).get('/api/applicants');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch applicants' });
    });
  });

  describe('GET /api/applicants/:id', () => {
    it('returns applicant JSON', async () => {
      const doc = { _id: 'id1', name: 'A' };
      applicantService.getApplicantById.mockResolvedValue(doc);

      const res = await request(app).get('/api/applicants/id1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(doc);
      expect(applicantService.getApplicantById).toHaveBeenCalledWith('id1');
    });

    it('returns 404 when not found', async () => {
      applicantService.getApplicantById.mockRejectedValue(new Error('Applicant not found'));

      const res = await request(app).get('/api/applicants/missing');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Applicant not found' });
    });

    it('returns 500 on unexpected errors', async () => {
      applicantService.getApplicantById.mockRejectedValue(new Error('Other'));

      const res = await request(app).get('/api/applicants/id1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch applicant' });
    });
  });

  describe('GET /api/applicants/:id/resume', () => {
    it('sends attachment disposition by default', async () => {
      const buf = Buffer.from('%PDF');
      applicantService.getApplicantResume.mockResolvedValue({ buffer: buf, contentType: 'application/pdf' });

      const res = await request(app).get('/api/applicants/id1/resume');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/pdf/);
      expect(res.headers['content-disposition']).toMatch(/attachment/);
      expect(res.body.equals(buf)).toBe(true);
    });

    it('uses inline disposition when inline=1', async () => {
      applicantService.getApplicantResume.mockResolvedValue({
        buffer: Buffer.from('x'),
        contentType: 'application/pdf',
      });

      const res = await request(app).get('/api/applicants/id1/resume?inline=1');

      expect(res.headers['content-disposition']).toMatch(/inline/);
    });

    it('returns 404 when applicant or resume missing', async () => {
      applicantService.getApplicantResume.mockRejectedValue(new Error('Applicant not found'));

      const res = await request(app).get('/api/applicants/id1/resume');

      expect(res.status).toBe(404);
    });

    it('returns 500 on unexpected errors', async () => {
      applicantService.getApplicantResume.mockRejectedValue(new Error('Other'));

      const res = await request(app).get('/api/applicants/id1/resume');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/applicants/:id/pfp', () => {
    it('sends image bytes', async () => {
      const buf = Buffer.from([0xff, 0xd8, 0xff]);
      userService.getPfp.mockResolvedValue({ buffer: buf, contentType: 'image/jpeg' });

      const res = await request(app).get('/api/applicants/id1/pfp');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/image\/jpeg/);
      expect(res.body.equals(buf)).toBe(true);
      expect(userService.getPfp).toHaveBeenCalledWith('applicant', 'id1');
    });

    it('returns 404 when user or picture missing', async () => {
      userService.getPfp.mockRejectedValue(new Error('User not found'));

      const res = await request(app).get('/api/applicants/id1/pfp');

      expect(res.status).toBe(404);
    });

    it('returns 404 for No profile picture', async () => {
      userService.getPfp.mockRejectedValue(new Error('No profile picture'));

      const res = await request(app).get('/api/applicants/id1/pfp');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/applicants/:id/pfp', () => {
    it('returns 400 when no file', async () => {
      const res = await request(app).put('/api/applicants/id1/pfp');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'No file uploaded' });
    });

    it('returns updated user JSON on success', async () => {
      const updated = { _id: 'id1', email: 'a@b.com' };
      userService.updatePfp.mockResolvedValue(updated);

      const res = await request(app)
        .put('/api/applicants/id1/pfp')
        .attach('file', Buffer.from('jpeg-bytes'), 'pfp.jpg');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
      expect(userService.updatePfp).toHaveBeenCalledWith(
        'applicant',
        'id1',
        expect.any(Buffer),
        expect.stringMatching(/image/)
      );
    });

    it('returns 400 when file is not an image', async () => {
      const res = await request(app)
        .put('/api/applicants/id1/pfp')
        .attach('file', Buffer.from('not an image'), {
          filename: 'notes.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/image/i);
      expect(userService.updatePfp).not.toHaveBeenCalled();
    });

    it('returns 400 when file exceeds size limit', async () => {
      const big = Buffer.alloc(6 * 1024 * 1024, 0);
      const res = await request(app)
        .put('/api/applicants/id1/pfp')
        .attach('file', big, 'huge.jpg');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/large|5 MB/i);
      expect(userService.updatePfp).not.toHaveBeenCalled();
    });

    it('returns 404 when user not found', async () => {
      userService.updatePfp.mockRejectedValue(new Error('User not found'));

      const res = await request(app)
        .put('/api/applicants/id1/pfp')
        .attach('file', Buffer.from('x'), 'p.jpg');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/applicants/:id/resume', () => {
    it('returns 400 when no file', async () => {
      const res = await request(app).post('/api/applicants/id1/resume');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'No file uploaded' });
    });

    it('returns updated applicant on success', async () => {
      const updated = { _id: 'id1' };
      applicantService.uploadApplicantResume.mockResolvedValue(updated);

      const res = await request(app)
        .post('/api/applicants/id1/resume')
        .attach('file', Buffer.from('%PDF'), 'cv.pdf');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
      expect(applicantService.uploadApplicantResume).toHaveBeenCalledWith(
        'id1',
        expect.any(Buffer),
        expect.stringMatching(/pdf|octet/)
      );
    });

    it('returns 404 when applicant not found', async () => {
      applicantService.uploadApplicantResume.mockRejectedValue(new Error('Applicant not found'));

      const res = await request(app)
        .post('/api/applicants/id1/resume')
        .attach('file', Buffer.from('x'), 'cv.pdf');

      expect(res.status).toBe(404);
    });

    it('returns 400 when file is not a PDF', async () => {
      const res = await request(app)
        .post('/api/applicants/id1/resume')
        .attach('file', Buffer.from('hello'), {
          filename: 'notes.txt',
          contentType: 'text/plain',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/pdf/i);
      expect(applicantService.uploadApplicantResume).not.toHaveBeenCalled();
    });

    it('returns 400 when file exceeds size limit', async () => {
      const big = Buffer.alloc(6 * 1024 * 1024, 0);
      const res = await request(app)
        .post('/api/applicants/id1/resume')
        .attach('file', big, 'huge.pdf');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/large|5 MB/i);
      expect(applicantService.uploadApplicantResume).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/applicants/:id/delete', () => {
    it('returns deleted true', async () => {
      userService.deleteAccount.mockResolvedValue({ deleted: true });

      const res = await request(app).post('/api/applicants/id1/delete');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(userService.deleteAccount).toHaveBeenCalledWith('applicant', 'id1');
    });

    it('returns 404 when user not found', async () => {
      userService.deleteAccount.mockRejectedValue(new Error('User not found'));

      const res = await request(app).post('/api/applicants/id1/delete');

      expect(res.status).toBe(404);
    });
  });
});
