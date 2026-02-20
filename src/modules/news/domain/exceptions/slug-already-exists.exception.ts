/**
 * SlugAlreadyExistsException
 * 
 * Thrown when trying to create news with existing slug.
 * Business rule: Slugs must be unique.
 */
export class SlugAlreadyExistsException extends Error {
    constructor(slug: string) {
        super(`Slug already exists: ${slug}`);
        this.name = 'SlugAlreadyExistsException';
    }
}
