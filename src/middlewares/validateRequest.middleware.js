import { ApiError } from '../utils/ApiError.js';
import  ApiResponse  from '../utils/ApiResponse.js';
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, convert: true });
    if (error) {
      const details = error.details.map((err) => err.message).join(', ');
      return next(new ApiError(400, details));
    }
    next();
  };
};

export{validateRequest}
