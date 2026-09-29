exports.sendSuccess = (res, statusCode, message, data = null, pagination = null) => {
  return res.status(statusCode).json({
    status: true,
    message: message,
    data: data,
    ...(pagination !== null && { pagination })
    // error: null
  });
};

exports.sendError = (res, statusCode, message, errorDetails = null) => {
  return res.status(statusCode).json({
    status: false,
    message: message,
    //data: null,
    //pagination: null,
    error: errorDetails 
      ? (typeof errorDetails === 'string' ? { server: [errorDetails] } : errorDetails) 
      : null
  });
};