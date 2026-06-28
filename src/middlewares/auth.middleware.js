import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { getJwtConfig } from "../config/jwtConfig.js";

export const verifyJWT = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request - No token provided");
    }

    const jwtConfig = getJwtConfig();

    if (!jwtConfig) {
      throw new ApiError(500, "JWT secret not configured");
    }

    try {
      const decodedToken = jwt.verify(token, jwtConfig.accessToken.secret);

      const user = await User.findById(decodedToken.userId).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token - User not found");
      }

      req.user = user;
      req.user.role = decodedToken.role;

      const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      if (roles.length && !roles.includes(req.user.role)) {
        throw new ApiError(403, "Forbidden - Insufficient role permissions");
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Access token expired");
      }

      if (error.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid access token");
      }

      throw error;
    }
  });