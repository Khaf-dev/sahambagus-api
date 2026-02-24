import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IUserRepository, InvalidCredentialsException } from '../../../user/domain';
import { UserMapper } from '../../../user/application';
import { AuthResponseDto } from '../dtos';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: {
    email: string;
    password: string;
  }): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Check if user is active
    if (!user.isActive) {
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Record login
    user.recordLogin();
    await this.userRepository.save(user);

    // Generate tokens
    const userDto = UserMapper.toDto(user);
    const accessToken = this.generateAccessToken(userDto);
    const refreshToken = this.generateRefreshToken(userDto);

    return {
      accessToken,
      refreshToken,
      user: userDto,
    };
  }

  private generateAccessToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
  }

  private generateRefreshToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}