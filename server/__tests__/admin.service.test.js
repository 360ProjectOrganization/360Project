jest.mock('../repository/admin.repository', () => ({
  findAll: jest.fn(),
  countJobPostings: jest.fn(),
  countUnfilledJobPostings: jest.fn(),
  countFilledJobPostings: jest.fn(),
  countAdmins: jest.fn(),
  countAplicants: jest.fn(),
  countCompanies: jest.fn(),
  countAllJobPostingsCreateWithDateCreated: jest.fn(),
  countAllAdminAccountsByDateCreated: jest.fn(),
  countAllApplicantsAccountsByDateCreated: jest.fn(),
  countAllCompaniesAccountsByDateCreated: jest.fn(),
}));

describe('admin.service', () => {
  let adminRepository;
  let adminService;

  beforeEach(() => {
    jest.resetModules();
    adminRepository = require('../repository/admin.repository');
    adminService = require('../service/admin.service');
    jest.clearAllMocks();
  });

  it('getAllAdmins returns repository findAll result', async () => {
    const admins = [{ _id: 'a1', email: 'admin@test.com' }];
    adminRepository.findAll.mockResolvedValue(admins);

    await expect(adminService.getAllAdmins()).resolves.toBe(admins);
    expect(adminRepository.findAll).toHaveBeenCalledWith();
  });

  it('findAllAnalytics includes combined user counts', async () => {
    adminRepository.countJobPostings.mockResolvedValue(10);
    adminRepository.countUnfilledJobPostings.mockResolvedValue(1);
    adminRepository.countFilledJobPostings.mockResolvedValue(2);
    adminRepository.countAdmins.mockResolvedValue(1);
    adminRepository.countAplicants.mockResolvedValue(4);
    adminRepository.countCompanies.mockResolvedValue(3);
    adminRepository.countAllJobPostingsCreateWithDateCreated.mockResolvedValue([]);
    adminRepository.countAllAdminAccountsByDateCreated.mockResolvedValue([]);
    adminRepository.countAllApplicantsAccountsByDateCreated.mockResolvedValue([]);
    adminRepository.countAllCompaniesAccountsByDateCreated.mockResolvedValue([]);

    const analytics = await adminService.findAllAnalytics();

    expect(analytics.numUsers).toBe(8);
    expect(analytics.numJobPostings).toBe(10);
  });
});
