const SequelizeFactory = require('../config/orm-config');
const ApiError = require('../error/api-error');

class HealthService{
   static checkHealth = async() => {
      try{
         const sequelize = SequelizeFactory().get()
         await sequelize.authenticate()
      }catch(error){
         throw ApiError.serviceUnavailable("service unavailable")
      }
   }   
}


module.exports = HealthService