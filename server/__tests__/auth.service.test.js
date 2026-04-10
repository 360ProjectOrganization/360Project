jest.mock('../repository/auth.repository', () => ({
  findDocumentByEmailAndRole: jest.fn(),
}));

describe('auth.service', () => {
  let authRepository;
  let authService;

  beforeEach(() => {
    jest.resetModules();
    authRepository = require('../repository/auth.repository');
    authService = require('../service/auth.service');
    jest.clearAllMocks();
  });

  it('register rejects an invalid role', async () => {
    await expect(
      authService.register('invalid', { email: 'a@b.com', password: 'password1', name: 'Test' })
    ).rejects.toThrow('Invalid role');
  });

  it('login rejects when no user exists for email and role', async () => {
    authRepository.findDocumentByEmailAndRole.mockResolvedValue(null);

    await expect(
      authService.login('missing@example.com', 'password1', 'applicant')
    ).rejects.toThrow('Invalid email or password');
  });
});
