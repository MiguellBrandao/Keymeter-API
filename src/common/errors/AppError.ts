export class AppError extends Error {
  public readonly httpStatus: number
  public readonly details?: Record<string, unknown>
  public readonly expose: boolean

  constructor(opts: {
    httpStatus: number
    message: string
    details?: Record<string, unknown>
    expose?: boolean
  }) {
    super(opts.message)
    this.name = "AppError"
    this.httpStatus = opts.httpStatus
    if (opts.details !== undefined) this.details = opts.details
    this.expose = opts.expose ?? true
  }
}
