import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw an error if the email already exists', async () => {
      const registerDto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'password',
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce({} as any);

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
    });

    it('should create a new user and return an access token', async () => {
      const registerDto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'password',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
      jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce({ email: 'test@test.com', id: '1' } as any);

      const result = await authService.register(registerDto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: 'hashedPassword',
      });
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });
});
