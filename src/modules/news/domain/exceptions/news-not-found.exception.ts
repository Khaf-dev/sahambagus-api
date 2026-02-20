/**
 * NewsNotFoundException
 * 
 * Thrown when news is not found by ID or slug
 * This is a domain exception, not HTTP exception.
 */
export class NewsNotFoundException extends Error {
    constructor(identifier: string) {
        super(`News not found: ${identifier}`);
        this.name = 'NewsNotFoundException';
    }
}
