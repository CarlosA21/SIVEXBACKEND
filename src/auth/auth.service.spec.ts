import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService - authentication failures', () => {
  const jwtService = { sign: jest.fn(), verify: jest.fn() };
  const usersService = { findByEmail: jest.fn() };
  const sessionsService = { create: jest.fn(), closeBySid: jest.fn() };
  const service = new AuthService(jwtService as any, usersService as any, sessionsService as any);

  beforeEach(() => jest.clearAllMocks());

  it('returns unauthorized for a nonexistent user and does not create a session', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.login({ email: 'missing@example.com', password: 'wrong-password' }, '127.0.0.1'))
      .rejects.toMatchObject({ status: HttpStatus.UNAUTHORIZED });

    expect(sessionsService.create).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('rejects logout without a token', async () => {
    await expect(service.logout('')).rejects.toMatchObject({ status: HttpStatus.UNAUTHORIZED });
    expect(sessionsService.closeBySid).not.toHaveBeenCalled();
  });
});
