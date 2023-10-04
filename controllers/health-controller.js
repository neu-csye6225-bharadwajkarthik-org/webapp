const {setSuccessResponse} = require('../utils/helpers/non-crud');
const StatusCodes = require('../utils/status-codes');
const HealthService = require('../services/health-service')

class HealthController{
   static checkHealth = async(req, res, next) => {
      try{
         await HealthService.checkHealth()
         setSuccessResponse(null, StatusCodes.OK, res);
      }catch(error){ // if db-server is down, or orm config is invalid, either way its server-side fault
         next(error);
      }
   }   
}


module.exports = HealthController;