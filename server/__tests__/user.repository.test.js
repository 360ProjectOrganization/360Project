jest.mock('../repository/models/applicant.model', () => ({
  findById: jest.fn(),
}));

jest.mock('../repository/models/company.model', () => ({
  findById: jest.fn(),
}));

jest.mock('../repository/models/administrator.model', () => ({
  findById: jest.fn(),
}));

const Applicant = require('../repository/models/applicant.model');
const userRepository = require('../repository/user.repository');

describe('user.repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getModel throws for an invalid role', () => {
    expect(() => userRepository.getModel('invalid')).toThrow('Invalid role');
  });

  it('findById returns lean applicant document when present', async () => {
    const lean = jest.fn().mockResolvedValue({ _id: 'a1' });
    Applicant.findById.mockReturnValue({
      select: jest.fn().mockReturnValue({ lean }),
    });

    await expect(userRepository.findById('applicant', 'a1')).resolves.toEqual({ _id: 'a1' });
  });
});
