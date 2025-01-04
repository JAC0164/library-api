import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginRequestDto } from './dto/login.dto';
import { RegisterRequestDto } from './dto/register.dto';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Return jwt token.' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequestDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: 201, description: 'Return user.' })
  @HttpCode(201)
  async register(@Body() registerBody: RegisterRequestDto) {
    return await this.authService.register(registerBody);
  }
}
