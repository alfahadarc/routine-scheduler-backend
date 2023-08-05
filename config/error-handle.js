// error-handler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging purposes
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ error: message });
  };
  
  export default errorHandler;
  