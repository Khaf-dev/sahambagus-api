/**
 * ContentStatus Value Object
 * 
 * Represent the editorial workflow status
 * Immutable - once created, cannot be changed
 * 
 * Valid transition:
 * DRAFT -> REVIEW -> PUBLISHED -> ARCHIVED
 *            REVIEW -> DRAFT
 */
export class ContentStatus {
    private static readonly VALID_STATUSES = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;

    private constructor(private readonly value: string) {
        if (!ContentStatus.VALID_STATUSES.includes(value as any)) {
            throw new Error(`Invalid content status: ${value}`);
        }
    }

    // ============================================
    // Factory methods
    // ============================================

    static DRAFT = new ContentStatus('DRAFT');
    static REVIEW = new ContentStatus('REVIEW');
    static PUBLISHED = new ContentStatus('PUBLISHED');
    static ARCHIVED = new ContentStatus('ARCHIVED');

    static fromString(status: string): ContentStatus {
        const upperStatus = status.toUpperCase();

        switch (upperStatus) {
            case 'DRAFT':
                return ContentStatus.DRAFT;
            case 'REVIEW':
                return ContentStatus.REVIEW;
            case 'PUBLISHED':
                return ContentStatus.PUBLISHED;
            case 'ARCHIVED':
                return ContentStatus.ARCHIVED;
            default:
                throw new Error(`Invalid content status: ${status}`);
        }
    }

    // ============================================
    // Query Methods
    // ============================================

    isDraft(): boolean {
        return this.value === 'DRAFT';
    }

    isReview(): boolean {
        return this.value === 'REVIEW';
    }

    isPublished(): boolean {
        return this.value === 'PUBLISHED';
    }

    isArchived(): boolean {
        return this.value === 'ARCHIVED';
    }

    // ============================================
    // Value Object Behavior
    // ============================================

    toString(): string {
        return this.value;
    }

    equals(other: ContentStatus): boolean {
        return this.value === other.value;
    }

    /**
     * Check if transition to new status is valid
     */
    canTransitionTo(newStatus: ContentStatus): boolean {
        const transitions: Record<string, string[]> = {
            DRAFT: ['REVIEW'],
            REVIEW: ['PUBLISHED', 'DRAFT'],
            PUBLISHED: ['ARCHIVED', 'DRAFT'],
            ARCHIVED: [],
        };

        return transitions[this.value]?.includes(newStatus.value) || false;
    }
}