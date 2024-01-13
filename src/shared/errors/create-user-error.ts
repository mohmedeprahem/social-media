export class CreateUserError extends Error {
  constructor(
    message: string,
    public readonly isOTPSent: boolean,
  ) {
    super(message);
    this.name = 'CreateUserError';
  }
}
