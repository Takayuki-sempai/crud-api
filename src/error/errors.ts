export class NotFoundError extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class RequestParseError extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}

export class InternalError extends Error {
  constructor(msg?: string) {
    super(msg);
  }
}
