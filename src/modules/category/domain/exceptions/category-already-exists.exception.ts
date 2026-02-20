export class CategoryAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Category already exists: ${name}`);
    this.name = 'CategoryAlreadyExistsException';
  }
}