jest.mock('../repository/models/administrator.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

jest.mock('../repository/models/jobPosting.model', () => ({}));
jest.mock('../repository/models/applicant.model', () => ({}));
jest.mock('../repository/models/company.model', () => ({}));

const Admin = require('../repository/models/administrator.model');
const adminRepository = require('../repository/admin.repository');

describe('admin.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('findAll returns lean administrator documents', async () => {
    const rows = [{ _id: 'ad1' }];
    const lean = jest.fn().mockResolvedValue(rows);
    const sort = jest.fn().mockReturnValue({ lean });
    const skip = jest.fn().mockReturnValue({ sort });
    const limit = jest.fn().mockReturnValue({ skip });
    const select = jest.fn().mockReturnValue({ limit });
    Admin.find.mockReturnValue({ select, limit, skip, sort, lean });

    const result = await adminRepository.findAll();

    expect(result).toEqual(rows);
  });

  it('countAdmins returns count from Admin.countDocuments', async () => {
    Admin.countDocuments.mockResolvedValue(7);

    await expect(adminRepository.countAdmins()).resolves.toBe(7);
  });
});
