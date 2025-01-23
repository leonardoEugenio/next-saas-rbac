export class UnanuthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Unanuthorized.')
  }
}
