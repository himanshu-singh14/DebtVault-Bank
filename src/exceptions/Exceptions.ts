enum HttpStatus {
  NotFound = 404,
  BadRequest = 400,
  Unauthorized = 401,
  AlreadyExist = 409,
}

class CustomError extends Error {
  constructor(message: string, status: HttpStatus) {
    super(message);
    this.name = message;
    this.status = status;
  }

  status: HttpStatus;
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.NotFound);
    this.name = message;
  }
}

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.BadRequest);
    this.name = message;
  }
}

class WrongPasswordError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.Unauthorized);
    this.name = message;
  }
}

class AlreadyExistError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.AlreadyExist);
    this.name = message;
  }
}

export { NotFoundError, BadRequestError, WrongPasswordError, AlreadyExistError };