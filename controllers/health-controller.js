const {setSuccessResponse} = require('../utils/helpers/non-crud');
const StatusCodes = require('../utils/status-codes');
const HealthService = require('../services/health-service')
const logger = require('../utils/logger');
const statsDClient = require('../utils/metrics');
class HealthController{
   static checkHealth = async(req, res, next) => {
      statsDClient.increment('endpoints.request.http.get.checkHealth');
      logger.info('GET: ENTERING checkHealth controller method.');
      try{
         await HealthService.checkHealth()
         logger.info('GET: EXITING checkHealth controller method with no errors.');
         statsDClient.increment('endpoints.response.http.get.success.checkHealth');
         setSuccessResponse(null, StatusCodes.OK, res);
      }catch(error){ // if db-server is down, or orm config is invalid, either way its server-side fault
         statsDClient.increment('endpoints.response.http.get.failure.checkHealth');
         logger.error(`GET: EXITING checkHealth controller method with error - `,error);
         next(error);
      }
   }   
}


module.exports = HealthController;