// Standardized API response utility

export const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data })
  });
};

export const errorResponse = (res, message, statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

export const paginatedResponse = (res, data, pagination, message = 'Data retrieved successfully') => {
  return res.json({
    success: true,
    message,
    data,
    pagination
  });
};
