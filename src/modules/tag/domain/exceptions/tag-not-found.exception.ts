export class TagNotFoundException extends Error {
    constructor(identifier: string) {
        super(`Tag not found: ${identifier}`);
        this.name = 'TagNotFoundException'
    }
}
