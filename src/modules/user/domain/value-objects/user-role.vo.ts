/**
 * UserRole Value Object
 * 
 * Represents user roles in the system
 * ADMIN | EDITOR | AUTHOR
 */
export class UserRole {
    private constructor(private readonly value: string) {
        this.validate();
    }

    private static readonly VALID_ROLES = ['ADMIN', 'EDITOR', 'AUTHOR'] as const;

    static readonly ADMIN = new UserRole('ADMIN');
    static readonly EDITOR = new UserRole('EDITOR');
    static readonly AUTHOR = new UserRole('AUTHOR');

    static fromString(value: string): UserRole {
        const upperValue = value.toUpperCase();

        if (!this.VALID_ROLES.includes(upperValue as any)) {
            throw new Error(`Invalid user role: ${value}`);
        }

        return new UserRole(upperValue);
    }

    toString(): string {
        return this.value;
    }

    isAdmin(): boolean {
        return this.value === 'ADMIN';
    }

    isEditor(): boolean {
        return this.value === 'EDITOR';
    }

    isAuthor(): boolean {
        return this.value === 'AUTHOR';
    }

    canPublish(): boolean {
        return this.isAdmin() || this.isEditor();
    }

    canEdit(): boolean {
        return this.isAdmin() || this.isEditor() || this.isAuthor();
    }

    private validate(): void {
        if (!UserRole.VALID_ROLES.includes(this.value as any)) {
            throw new Error(`Invalid user role: ${this.value}`);
        }
    }
}