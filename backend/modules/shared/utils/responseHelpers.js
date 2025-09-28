const handleAsync = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message;
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

const handleServiceError = (res, error) => {
  console.error('Service Error:', error);

  // Handle specific error types
  if (error.message.includes('not found')) {
    return sendError(res, error.message, 404);
  }
  
  if (error.message.includes('unauthorized') || error.message.includes('Already enrolled')) {
    return sendError(res, error.message, 400);
  }

  if (error.message.includes('required') || error.message.includes('validation')) {
    return sendError(res, error.message, 400);
  }

  // Default server error
  return sendError(res, 'Internal server error', 500, error);
};

export {
  handleAsync,
  sendSuccess,
  sendError,
  handleServiceError
};
