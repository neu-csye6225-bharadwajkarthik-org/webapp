const SequelizeFactory = require('../config/orm-config');
const ApiError = require('../error/api-error');
const logger = require('../utils/logger');

class HealthService{
   static checkHealth = async() => {
      logger.info('GET: ENTERING checkHealth service method.');
      try{
         const sequelize = SequelizeFactory().get()
         await sequelize.authenticate()
         logger.info('GET: EXITING checkHealth service method with no errors.');
      }catch(error){
         logger.error(`GET: EXITING checkHealth service method with error -`,error);
         throw ApiError.serviceUnavailable("service unavailable")
      }
   }   
}


module.exports = HealthService