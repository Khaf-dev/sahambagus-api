export class SlugAlreadyExistsException extends Error {
    constructor(slug: string) {
        super(`Slug already exists: ${slug}`);
        this.name = 'SlugAlreadyExistsException';
    }
}