jest.mock('../repository/models/applicant.model', () => ({
  findOne: jest.fn(),
}));

jest.mock('../repository/models/company.model', () => ({}));
jest.mock('../repository/models/administrator.model', () => ({}));

const Applicant = require('../repository/models/applicant.model');
const authRepository = require('../repository/auth.repository');

describe('auth.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getModel throws for an invalid role', () => {
    expect(() => authRepository.getModel('not-a-role')).toThrow('Invalid role');
  });

  it('isEmailTaken returns false when no document matches', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    Applicant.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({ lean }),
    });

    await expect(authRepository.isEmailTaken('free@example.com', 'applicant')).resolves.toBe(false);
  });
});
