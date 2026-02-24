export class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    lastLogin: Date | null;
}