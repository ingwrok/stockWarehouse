import { STATUS_CODE } from "./statusCode";

export type ErrorObject = { [key: string]: any } | Array<ErrorObject>;

export default class ErrorHandler extends Error {
  constructor(public message: string, public statusCode: number, public details?: ErrorObject) {
    super(message);
  }

  private static createHttpError(
    errorMessage: string = "",
    statusCode: STATUS_CODE = STATUS_CODE.BAD_REQUEST,
    details?: ErrorObject,
  ) {
    return new this(errorMessage, statusCode, details);
  }

  static createError(errorDetail: string, statusCode?: STATUS_CODE, details?: ErrorObject) {
    return this.createHttpError(errorDetail, statusCode, details);
  }

  static createErrorObject(details: ErrorObject) {
    return this.createHttpError("Bad Request", STATUS_CODE.BAD_REQUEST, details);
  }

  static badRequest(message?: string, details?: ErrorObject) {
    return this.createHttpError(message, STATUS_CODE.BAD_REQUEST, details);
  }

  static unauthorized(message?: string, details?: ErrorObject) {
    return this.createHttpError(message, STATUS_CODE.UNAUTHORIZED, details);
  }

  static forbidden(message?: string, details?: ErrorObject) {
    return this.createHttpError(message, STATUS_CODE.FORBIDDEN, details);
  }

  static notFound(message?: string, details?: ErrorObject) {
    return this.createHttpError(message, STATUS_CODE.NOT_FOUND, details);
  }

  static notAcceptable(message?: string, details?: ErrorObject) {
    return this.createHttpError(message, STATUS_CODE.NOT_ACCEPTABLE, details);
  }

  static notImplemented(message?: string, details?: ErrorObject) {
    return this.createHttpError(message, STATUS_CODE.NOT_IMPLEMENTED, details);
  }
}
