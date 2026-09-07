export class AppError extends Error {
  readonly statusCode: number;
  readonly detalhes?: unknown;

  constructor(message: string, statusCode = 400, detalhes?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.detalhes = detalhes;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static naoEncontrado(entidade: string) {
    return new AppError(`${entidade} não encontrado(a)`, 404);
  }

  static conflito(message: string, detalhes?: unknown) {
    return new AppError(message, 409, detalhes);
  }
}
