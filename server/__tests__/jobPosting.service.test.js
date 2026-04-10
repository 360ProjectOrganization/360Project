jest.mock('../repository/models/jobPosting.model', () => ({
  STATUSES: ['ACTIVE', 'UNPUBLISHED', 'CLOSED'],
  CLOSURE_REASONS: ['FILLED', 'UNFILLED', 'CANCELLED'],
}));

jest.mock('../repository/applicant.repository', () => ({}));
jest.mock('../repository/user.repository', () => ({}));

jest.mock('../repository/jobPosting.repository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
}));

describe('jobPosting.service', () => {
  let jobPostingRepository;
  let jobPostingService;

  beforeEach(() => {
    jest.resetModules();
    jobPostingRepository = require('../repository/jobPosting.repository');
    jobPostingService = require('../service/jobPosting.service');
    jest.clearAllMocks();
  });

  it('getJobPostings delegates to the repository', async () => {
    const jobs = [{ _id: 'j1', title: 'Dev' }];
    jobPostingRepository.findAll.mockResolvedValue(jobs);

    await expect(jobPostingService.getJobPostings()).resolves.toBe(jobs);
    expect(jobPostingRepository.findAll).toHaveBeenCalledWith({}, {});
  });

  it('getJobPostingById throws when job is missing', async () => {
    jobPostingRepository.findById.mockResolvedValue(null);

    await expect(jobPostingService.getJobPostingById('nope')).rejects.toThrow('Job posting not found');
  });
});
