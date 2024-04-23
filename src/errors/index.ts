import type TelegramBot from 'node-telegram-bot-api';
import { type CallbackQuery, type Message } from 'node-telegram-bot-api';

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

  static User: typeof UserError;
  static LastFm: typeof LastFmError;
  static Service: typeof ServiceError;
  static Validation: typeof ValidationError;

  constructor (public message: string) {
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
  constructor (message?: string) {
    super(message ?? 'Last.fm user does not exist!!!');
    this.type = AppErrors.lastFmError;
  }
}

class ServiceError extends AppError {
  constructor () {
    super('Something went wrong!!!');
    this.type = AppErrors.serviceUnavailableError;
  }
}

class ValidationError extends AppError {
  constructor (message: string) {
    super(message);
    this.type = AppErrors.validationError;
  }
}

AppError.User = UserError;
AppError.LastFm = LastFmError;
AppError.Service = ServiceError;
AppError.Validation = ValidationError;

export const errorHandler = async (func: Promise<void>) => {
  try {
    await func;
  } catch (error) {
    console.error('error: ', error);
  }
};

export { AppError };
