enum AppErrors {
  appError,
  userError,
  serverError,
  notFoundError,
  validationError,
  unauthorizedError,
  forbiddenError,
  conflictError,
  badRequestError,
  notImplementedError,
  internalServerError,
  serviceUnavailableError,
  lastFmError,
}

class AppError extends Error {
  type: AppErrors;

  static UserError: typeof UserError;
  static LastFmError: typeof LastFmError;
  static ServiceError: typeof ServiceError;

  constructor (
    public message: string
  ) {
    super(message);
    this.type = AppErrors.appError;
  }
}

class UserError extends AppError {
  constructor () {
    super('User user does not exist!!!');
    this.type = AppErrors.userError;
  }
}

class LastFmError extends AppError {
  constructor () {
    super('Last.fm user does not exist!!!');
    this.type = AppErrors.lastFmError;
  }
}

class ServiceError extends AppError {
  constructor () {
    super('Something went wrong!!!');
    this.type = AppErrors.serviceUnavailableError;
  }
}

AppError.UserError = UserError;
AppError.LastFmError = LastFmError;
AppError.ServiceError = ServiceError;

export { AppError };
