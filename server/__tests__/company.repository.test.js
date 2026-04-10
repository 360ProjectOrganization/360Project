jest.mock('../repository/models/company.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../repository/models/jobPosting.model', () => ({}));

const Company = require('../repository/models/company.model');
const companyRepository = require('../repository/company.repository');

describe('company.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAll returns lean documents from Company.find chain', async () => {
    const rows = [{ _id: 'c1', name: 'Acme' }];
    const lean = jest.fn().mockResolvedValue(rows);
    const sort = jest.fn().mockReturnValue({ lean });
    const skip = jest.fn().mockReturnValue({ sort });
    const limit = jest.fn().mockReturnValue({ skip });
    const select = jest.fn().mockReturnValue({ limit });
    Company.find.mockReturnValue({ select, limit, skip, sort, lean });

    const result = await companyRepository.findAll();

    expect(Company.find).toHaveBeenCalledWith({});
    expect(result).toEqual(rows);
  });

  it('findById returns null when no company exists', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    Company.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({ lean }),
    });

    await expect(companyRepository.findById('missing')).resolves.toBeNull();
  });
});
