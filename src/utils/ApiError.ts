class ApiError extends Error {
  statusCode: number;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
export default ApiError;
