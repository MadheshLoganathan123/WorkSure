export class ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code: number;

  constructor(code: number, message?: string, data?: T) {
    this.code = code;
    this.success = code >= 200 && code < 400;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }

  /**
   * Convenience factory for successful responses.
   */
  static success<T>(data?: T, message = 'Success', code = 200): ApiResponse<T> {
    return new ApiResponse<T>(code, message, data);
  }

  /**
   * Convenience factory for error responses.
   */
  static error(message = 'Internal Server Error', code = 500): ApiResponse<null> {
    return new ApiResponse<null>(code, message);
  }
}
