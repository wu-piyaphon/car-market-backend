import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn(() => 'test-secret'),
  } as unknown as ConfigService;

  beforeEach(() => {
    strategy = new JwtStrategy(mockConfigService);
  });

  describe('validate', () => {
    it('should return the user for an access token payload', async () => {
      const result = await strategy.validate({
        id: 'user-uuid',
        email: 'test@example.com',
      });

      expect(result).toEqual({ id: 'user-uuid', email: 'test@example.com' });
    });

    it('should reject a refresh token used as an access token', async () => {
      await expect(
        strategy.validate({
          id: 'user-uuid',
          email: 'test@example.com',
          type: 'refresh',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
