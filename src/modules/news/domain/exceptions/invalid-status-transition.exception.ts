/**
 * InvalidStatusTransitionException
 * 
 * Thrown when attempting invalid status transition.
 * E.g., ARCHIVED -> PUBLISHED
 */
export class InvalidStatusTransitionException extends Error {
    constructor(from: string, to: string) {
        super(`Invalid status transition from ${from} to ${to}`);
        this.name = 'InvalidStatusTransitionException';
    }
}