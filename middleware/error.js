const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  // Make copy of the 'err' object
  // use spread operator to take all the properties from 'err' and put them into new 'error' variable
  let error = { ...err }
  error.message = err.message

  // Log to console for dev
  console.log(err.stack.red)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`
    console.log(`This is from the cast error if statement. Checking err value ${err.value}`)
    error = new ErrorResponse(message, 404)
  };

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler

/**
*   @desc EXPRESS MIDDLEWARE ERROR HANDLING
*   @docs https://expressjs.com/en/guide/error-handling.html

*   @notes err has a message 'property'
*/
