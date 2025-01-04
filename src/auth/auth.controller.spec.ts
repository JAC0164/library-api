import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and return access token', async () => {
      const registerDto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'password',
      };

      const result = { access_token: 'jwt-token' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(registerDto)).toBe(result);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const registerDto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new BadRequestException('email already exists'));

      await expect(authController.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
