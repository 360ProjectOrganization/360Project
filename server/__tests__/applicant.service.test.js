jest.mock('../repository/applicant.repository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdForResume: jest.fn(),
  updateResume: jest.fn(),
}));

describe('ApplicantService', () => {
  let applicantRepository;
  let applicantService;

  beforeEach(() => {
    jest.resetModules();
    applicantRepository = require('../repository/applicant.repository');
    applicantService = require('../service/applicant.service');
    jest.clearAllMocks();
  });

  describe('getAllApplicants', () => {
    it('returns repository findAll result', async () => {
      const rows = [{ _id: '1', email: 'a@b.com' }];
      applicantRepository.findAll.mockResolvedValue(rows);

      const result = await applicantService.getAllApplicants();

      expect(result).toBe(rows);
      expect(applicantRepository.findAll).toHaveBeenCalledWith();
    });
  });

  describe('getApplicantById', () => {
    it('throws when applicant is missing', async () => {
      applicantRepository.findById.mockResolvedValue(null);

      await expect(applicantService.getApplicantById('id1')).rejects.toThrow('Applicant not found');
    });

    it('returns applicant when found', async () => {
      const doc = { _id: 'id1', email: 'a@b.com' };
      applicantRepository.findById.mockResolvedValue(doc);

      await expect(applicantService.getApplicantById('id1')).resolves.toBe(doc);
    });
  });

  describe('getApplicantResume', () => {
    it('throws when document is missing', async () => {
      applicantRepository.findByIdForResume.mockResolvedValue(null);

      await expect(applicantService.getApplicantResume('id1')).rejects.toThrow('Applicant not found');
    });

    it('throws when resume buffer is empty', async () => {
      applicantRepository.findByIdForResume.mockResolvedValue({ _id: 'id1', resume: Buffer.alloc(0) });

      await expect(applicantService.getApplicantResume('id1')).rejects.toThrow('Applicant not found');
    });

    it('returns buffer and default content type when resumeContentType omitted', async () => {
      const buf = Buffer.from('%PDF-1.4', 'utf8');
      applicantRepository.findByIdForResume.mockResolvedValue({
        _id: 'id1',
        resume: buf,
      });

      const result = await applicantService.getApplicantResume('id1');

      expect(result).toEqual({ buffer: buf, contentType: 'application/pdf' });
    });

    it('returns stored content type when present', async () => {
      const buf = Buffer.from('x');
      applicantRepository.findByIdForResume.mockResolvedValue({
        _id: 'id1',
        resume: buf,
        resumeContentType: 'application/octet-stream',
      });

      const result = await applicantService.getApplicantResume('id1');

      expect(result).toEqual({ buffer: buf, contentType: 'application/octet-stream' });
    });
  });

  describe('uploadApplicantResume', () => {
    it('delegates to updateResume when applicant exists', async () => {
      applicantRepository.findById.mockResolvedValue({ _id: 'id1' });
      const updated = { _id: 'id1', email: 'a@b.com' };
      const buf = Buffer.from('pdf');
      applicantRepository.updateResume.mockResolvedValue(updated);

      const result = await applicantService.uploadApplicantResume('id1', buf, 'application/pdf');

      expect(applicantRepository.updateResume).toHaveBeenCalledWith('id1', buf, 'application/pdf');
      expect(result).toBe(updated);
    });
  });
});
