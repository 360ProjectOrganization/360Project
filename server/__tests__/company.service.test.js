jest.mock('../repository/company.repository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
}));

describe('company.service', () => {
  let companyRepository;
  let companyService;

  beforeEach(() => {
    jest.resetModules();
    companyRepository = require('../repository/company.repository');
    companyService = require('../service/company.service');
    jest.clearAllMocks();
  });

  it('getAllCompanies returns repository findAll result', async () => {
    const rows = [{ _id: 'c1', name: 'Acme' }];
    companyRepository.findAll.mockResolvedValue(rows);

    await expect(companyService.getAllCompanies()).resolves.toBe(rows);
    expect(companyRepository.findAll).toHaveBeenCalledWith();
  });

  it('getCompanyById throws when company is missing', async () => {
    companyRepository.findById.mockResolvedValue(null);

    await expect(companyService.getCompanyById('missing')).rejects.toThrow('Company not found');
  });
});
