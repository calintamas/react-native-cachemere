export class ItemNotFoundError extends Error {
  constructor(message: string) {
    super();
    this.name = 'ItemNotFoundError';
    this.message = message;
  }
}
