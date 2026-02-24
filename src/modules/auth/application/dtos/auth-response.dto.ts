import { UserResponseDto } from "src/modules/user/application/dtos";

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}