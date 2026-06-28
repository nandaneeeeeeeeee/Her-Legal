

import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const errorMiddleware = (err, _req, res, _next) => {
  const statusCode = (err instanceof ApiError ? err.statusCode : undefined) ?? 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${message} - ${err.stack || 'No stack trace available'}`);
  
  ApiResponse.error(res, message, statusCode);
};