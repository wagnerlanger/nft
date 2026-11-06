export class HttpError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, message: string, code = 'http_error') {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError
}
