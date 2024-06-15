import { Commands } from '../constants';
import { type BotController } from 'controllers';

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
  systemError,
}

class AppError extends Error {
  type: AppErrors;

  static User: typeof UserError;
  static LastFm: typeof LastFmError;
  static Service: typeof ServiceError;
  static Validation: typeof ValidationError;
  static SystemError: typeof SystemError;

  constructor (public message: string) {
    super(message);
    this.type = AppErrors.appError;
  }

  isUserError = () => this.type === AppErrors.userError;
  isLastFMError = () => this.type === AppErrors.lastFmError;
  isSystemFMError = () => this.type === AppErrors.systemError;
  isValidationError = () => this.type === AppErrors.validationError;
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

class SystemError extends AppError {
  constructor (message: string) {
    super(message ?? 'System error!!!');
    this.type = AppErrors.systemError;
  }
}

AppError.User = UserError;
AppError.LastFm = LastFmError;
AppError.Service = ServiceError;
AppError.Validation = ValidationError;
AppError.SystemError = SystemError;

const sendDefaultError = (botController: BotController, userId: number) => {
  void botController.bot.sendMessage(userId, 'Something went wrong!!!');
};

export const errorHandler =
  (botController: BotController, userId: number) =>
    async (func: Promise<void>) => {
      try {
        await func;
      } catch (error) {
        console.error(error);
        if (!(error instanceof AppError)) {
          sendDefaultError(botController, userId);
          return;
        }

        if (error.isUserError()) {
          void botController.bot.sendMessage(
            userId,
          `You should create account first!!!\nRun command /${Commands.START}}`
          );
          return;
        }

        if (error.isValidationError()) {
          void botController.bot.sendMessage(userId, error.message);
          return;
        }

        if (error.isLastFMError()) {
          void botController.bot.sendMessage(
            userId,
          `You should set your lastfm name!!!\nRun command /${Commands.SET_NAME}`
          );
          return;
        }

        if (error.isSystemFMError()) {
          sendDefaultError(botController, userId);
        }
      }
    };

export { AppError };
