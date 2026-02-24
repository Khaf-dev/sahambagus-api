import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiResponseSwagger,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterUseCase, LoginUseCase, GetCurrentUserUseCase } from '../../application';
import { RegisterRequestDto, LoginRequestDto } from '../dtos';
import { ApiResponse } from '../../../../shared/response/api-response';
import { JwtAuthGuard } from '../../infrastructure/guards';
import { Public, CurrentUser } from '../../infrastructure/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Register new user', 
    description: 'Create a new user account with email and password. Password must be at least 8 characters with uppercase, lowercase, number, and special character.' 
  })
  @ApiResponseSwagger({ status: 201, description: 'User registered successfully with JWT tokens' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid input or user already exists' })
  async register(@Body() dto: RegisterRequestDto) {
    const result = await this.registerUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Login', 
    description: 'Authenticate user and receive JWT access token (1h) and refresh token (7d)' 
  })
  @ApiResponseSwagger({ status: 200, description: 'Login successful' })
  @ApiResponseSwagger({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.loginUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user', 
    description: 'Get authenticated user profile. Requires valid JWT token in Authorization header.' 
  })
  @ApiResponseSwagger({ status: 200, description: 'User profile retrieved' })
  @ApiResponseSwagger({ status: 401, description: 'Unauthorized - invalid or expired token' })
  async getCurrentUser(@CurrentUser() user: any) {
    const result = await this.getCurrentUserUseCase.execute(user.userId);
    return ApiResponse.success(result);
  }
}