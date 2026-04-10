jest.mock('../repository/models/jobPosting.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../repository/models/company.model', () => ({
  findById: jest.fn(),
}));

jest.mock('../repository/models/applicant.model', () => ({
  updateMany: jest.fn(),
}));

const JobPosting = require('../repository/models/jobPosting.model');
const jobPostingRepository = require('../repository/jobPosting.repository');

describe('jobPosting.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findById resolves null when job does not exist', async () => {
    JobPosting.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(jobPostingRepository.findById('missing')).resolves.toBeNull();
  });

  it('findAll returns jobs from the query chain', async () => {
    const jobs = [{ _id: 'j1' }];
    const lean = jest.fn().mockResolvedValue(jobs);
    const sort = jest.fn().mockReturnValue({ lean });
    const skip = jest.fn().mockReturnValue({ sort });
    const limit = jest.fn().mockReturnValue({ skip });
    JobPosting.find.mockReturnValue({ limit, skip, sort, lean });

    await expect(jobPostingRepository.findAll()).resolves.toEqual(jobs);
  });
});
