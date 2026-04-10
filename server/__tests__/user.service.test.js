jest.mock('../repository/user.repository', () => ({
  findByIdForPfp: jest.fn(),
  findById: jest.fn(),
  updatePfp: jest.fn(),
}));

describe('user.service', () => {
  let userRepository;
  let userService;

  beforeEach(() => {
    jest.resetModules();
    userRepository = require('../repository/user.repository');
    userService = require('../service/user.service');
    jest.clearAllMocks();
  });

  it('getPfp throws when user is not found', async () => {
    userRepository.findByIdForPfp.mockResolvedValue(null);

    await expect(userService.getPfp('applicant', 'missing')).rejects.toThrow('User not found');
  });

  it('updatePfp throws when user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      userService.updatePfp('company', 'missing', Buffer.from('x'), 'image/png')
    ).rejects.toThrow('User not found');
  });
});
