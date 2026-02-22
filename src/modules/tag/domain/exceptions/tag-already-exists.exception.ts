export class TagAlreadyExistsException extends Error {
    constructor(name: string) {
        super(`Tag already exists: ${name}`);
        this.name = 'TagAlreadyExistsException';
    }
}