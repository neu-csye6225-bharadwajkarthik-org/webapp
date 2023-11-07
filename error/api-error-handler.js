const StatusCodes = require('../utils/status-codes')
const ApiError = require('./api-error')
const {setErrorResponse} = require('../utils/helpers/non-crud');
const logger = require('../utils/logger');

const apiErrorHandler = (err, req, res, next) => {
   console.log(`err : `, err)
   if(err instanceof SyntaxError){
      logger.error('EXITING apiErrorHandler with syntax error - Syntax error in payload');
      setErrorResponse(ApiError.badRequest("Syntax error in payload"),res)
      return
   }
   if(err instanceof ApiError){
      setErrorResponse(err, res)
      return
   }
   
   const unexpectedServerSideError = {
      msg : 'something went wrong',
      code : StatusCodes.INTERNAL_SERVER_ERROR
   }

   setErrorResponse(unexpectedServerSideError, res)
}

module.exports = apiErrorHandler;