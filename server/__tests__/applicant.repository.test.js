jest.mock('../repository/models/applicant.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

function chainFindAll(leanResult) {
  const lean = jest.fn().mockResolvedValue(leanResult);
  const sort = jest.fn().mockReturnValue({ lean });
  const skip = jest.fn().mockReturnValue({ sort });
  const limit = jest.fn().mockReturnValue({ skip });
  const select = jest.fn().mockReturnValue({ limit });
  return { select, limit, skip, sort, lean };
}

function chainFindByIdLean(leanResult) {
  const lean = jest.fn().mockResolvedValue(leanResult);
  const select = jest.fn().mockReturnValue({ lean });
  return { select, lean };
}

function chainFindByIdAndUpdate(leanResult) {
  const lean = jest.fn().mockResolvedValue(leanResult);
  const select = jest.fn().mockReturnValue({ lean });
  return { select, lean };
}

describe('applicantRepository', () => {
  let Applicant;
  let applicantRepository;

  beforeEach(() => {
    jest.resetModules();
    Applicant = require('../repository/models/applicant.model');
    applicantRepository = require('../repository/applicant.repository');
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('applies default options and returns lean documents', async () => {
      const rows = [{ _id: 'a', email: 'x@y.com' }];
      const chain = chainFindAll(rows);
      Applicant.find.mockReturnValue(chain);

      const result = await applicantRepository.findAll();

      expect(Applicant.find).toHaveBeenCalledWith({});
      expect(chain.select).toHaveBeenCalledWith('-password -pfp -resume');
      expect(chain.limit).toHaveBeenCalledWith(50);
      expect(chain.skip).toHaveBeenCalledWith(0);
      expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(rows);
    });

    it('passes custom filter and options', async () => {
      const chain = chainFindAll([]);
      Applicant.find.mockReturnValue(chain);

      await applicantRepository.findAll({ status: 'active' }, { limit: 10, skip: 5, sort: { name: 1 } });

      expect(Applicant.find).toHaveBeenCalledWith({ status: 'active' });
      expect(chain.limit).toHaveBeenCalledWith(10);
      expect(chain.skip).toHaveBeenCalledWith(5);
      expect(chain.sort).toHaveBeenCalledWith({ name: 1 });
    });
  });

  describe('findById', () => {
    it('selects safe fields and leans', async () => {
      const doc = { _id: 'id1', name: 'A' };
      const chain = chainFindByIdLean(doc);
      Applicant.findById.mockReturnValue(chain);

      const result = await applicantRepository.findById('id1');

      expect(Applicant.findById).toHaveBeenCalledWith('id1');
      expect(chain.select).toHaveBeenCalledWith('-password -pfp -resume');
      expect(result).toEqual(doc);
    });
  });

  describe('findByIdForResume', () => {
    it('selects resume fields only', async () => {
      const doc = { resume: Buffer.from('ab'), resumeContentType: 'application/pdf' };
      const select = jest.fn().mockResolvedValue(doc);
      Applicant.findById.mockReturnValue({ select });

      const result = await applicantRepository.findByIdForResume('id1');

      expect(Applicant.findById).toHaveBeenCalledWith('id1');
      expect(select).toHaveBeenCalledWith('resume resumeContentType');
      expect(result).toEqual(doc);
    });
  });

  describe('hasResume', () => {
    it('returns false when resume is not a non-empty buffer', async () => {
      Applicant.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ resume: 'not-buffer' }),
      });

      await expect(applicantRepository.hasResume('id1')).resolves.toBe(false);
    });

    it('returns true when resume is a non-empty buffer', async () => {
      Applicant.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ resume: Buffer.from('pdf') }),
      });

      await expect(applicantRepository.hasResume('id1')).resolves.toBe(true);
    });
  });

  describe('updateResume', () => {
    it('updates resume fields and returns lean safe document', async () => {
      const updated = { _id: 'id1', email: 'a@b.com' };
      const chain = chainFindByIdAndUpdate(updated);
      Applicant.findByIdAndUpdate.mockReturnValue(chain);
      const buf = Buffer.from('data');

      const result = await applicantRepository.updateResume('id1', buf, 'application/pdf');

      expect(Applicant.findByIdAndUpdate).toHaveBeenCalledWith(
        'id1',
        { resume: buf, resumeContentType: 'application/pdf' },
        { new: true }
      );
      expect(chain.select).toHaveBeenCalledWith('-password -pfp -resume');
      expect(result).toEqual(updated);
    });

    it('defaults content type to application/pdf when omitted', async () => {
      const chain = chainFindByIdAndUpdate({});
      Applicant.findByIdAndUpdate.mockReturnValue(chain);
      const buf = Buffer.from('x');

      await applicantRepository.updateResume('id1', buf, null);

      expect(Applicant.findByIdAndUpdate).toHaveBeenCalledWith(
        'id1',
        { resume: buf, resumeContentType: 'application/pdf' },
        { new: true }
      );
    });
  });
});
