const UserService = require('../services/user-service')
const logger = require('../utils/logger');
const statsDClient = require('../utils/metrics');

class UserController{
   static createUsers = async(userData) => {
      logger.info('POST: ENTERING createUsers controller method.');
      statsDClient.increment('endpoints.request.http.post.createUsers');
      try{
          await UserService.createUsers(userData)
          logger.info('POST: EXITING createUsers controller method with no errors.');
          statsDClient.increment('endpoints.response.http.post.success.createUsers');
      }catch(error){
         statsDClient.increment('endpoints.response.http.post.failure.createUsers');
         logger.error(`POST: EXITING createUsers controller method with error -
        ${error}`);
         console.log(`Error in User controller method in loading and creating users : `, error)
         throw error
      }     
   }

   static findUserByEmail = async(email) => {
      logger.info('GET: ENTERING findUserByEmail controller method.');
      statsDClient.increment('endpoints.request.http.get.findUserByEmail');
      try{
         const user = await UserService.findUserByEmail(email)
         logger.info('GET: EXITING findUserByEmail controller method with no errors.');
         statsDClient.increment('endpoints.response.http.get.success.findUserByEmail');
         return user;
      }catch(error){
         statsDClient.increment('endpoints.response.http.get.failure.findUserByEmail');
         logger.error(`GET: EXITING findUserByEmail controller method with error -
        ${error}`);
         console.log(`Error in User Controller method in finding user by email : `, error)
         throw error
      }
   }
}

module.exports = UserController;