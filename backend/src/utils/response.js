/* Common Response Handler */
const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

// Success response
const successResponse = (res, statusCode, message, data) => {
  return sendResponse(res, statusCode, true, message, data);
};

// Error response
const errorResponse = (res, statusCode, message, error) => {
  return sendResponse(res, statusCode, false, message, null, error);
};

module.exports = {
  sendResponse,
  successResponse,
  errorResponse,
};
