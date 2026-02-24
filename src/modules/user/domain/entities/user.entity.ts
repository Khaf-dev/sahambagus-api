import { UserRole } from '../value-objects';

/**
 * User Domain Entity
 * 
 * Represents a user in the system with authentication and authorization.
 */
export class UserEntity {
  private constructor(
    public readonly id: string,
    private _email: string,
    private _password: string,
    private _firstName: string,
    private _lastName: string,
    private _role: UserRole,
    private _isActive: boolean,
    public readonly createdAt: Date,
    private _updatedAt: Date,
    private _lastLogin: Date | null,
  ) {}

  // Getters
  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get role(): UserRole {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get lastLogin(): Date | null {
    return this._lastLogin;
  }

  /**
   * Factory method to create a new user
   */
  static create(props: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): UserEntity {
    // Validate email format
    if (!this.isValidEmail(props.email)) {
      throw new Error('Invalid email format');
    }

    // Validate names
    if (props.firstName.trim().length < 2) {
      throw new Error('First name must be at least 2 characters');
    }
    if (props.lastName.trim().length < 2) {
      throw new Error('Last name must be at least 2 characters');
    }

    return new UserEntity(
      props.id,
      props.email.toLowerCase().trim(),
      props.password,
      props.firstName.trim(),
      props.lastName.trim(),
      props.role || UserRole.AUTHOR,
      true,
      new Date(),
      new Date(),
      null,
    );
  }

  /**
   * Reconstitute user from database
   */
  static reconstitute(props: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
  }): UserEntity {
    return new UserEntity(
      props.id,
      props.email,
      props.password,
      props.firstName,
      props.lastName,
      UserRole.fromString(props.role),
      props.isActive,
      props.createdAt,
      props.updatedAt,
      props.lastLogin,
    );
  }

  /**
   * Update user profile
   */
  updateProfile(props: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): void {
    if (props.firstName !== undefined) {
      if (props.firstName.trim().length < 2) {
        throw new Error('First name must be at least 2 characters');
      }
      this._firstName = props.firstName.trim();
    }

    if (props.lastName !== undefined) {
      if (props.lastName.trim().length < 2) {
        throw new Error('Last name must be at least 2 characters');
      }
      this._lastName = props.lastName.trim();
    }

    if (props.email !== undefined) {
      if (!UserEntity.isValidEmail(props.email)) {
        throw new Error('Invalid email format');
      }
      this._email = props.email.toLowerCase().trim();
    }

    this._updatedAt = new Date();
  }

  /**
   * Update password
   */
  updatePassword(newHashedPassword: string): void {
    this._password = newHashedPassword;
    this._updatedAt = new Date();
  }

  /**
   * Update role (Admin only)
   */
  updateRole(newRole: UserRole): void {
    this._role = newRole;
    this._updatedAt = new Date();
  }

  /**
   * Activate user
   */
  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Deactivate user
   */
  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Record login
   */
  recordLogin(): void {
    this._lastLogin = new Date();
  }

  /**
   * Check if user can perform admin actions
   */
  canPerformAdminActions(): boolean {
    return this._isActive && this._role.isAdmin();
  }

  /**
   * Check if user can publish content
   */
  canPublishContent(): boolean {
    return this._isActive && this._role.canPublish();
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}