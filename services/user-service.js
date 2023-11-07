const ApiError = require('../error/api-error');
const { userModel } = require('../models/index');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

class UserService {
   static createUsers = async (usersData) => {
      logger.info('POST: ENTERING createUsers service method.');
      try {
         // Hash passwords before adding users
         const hashedUsersData = await Promise.all(
         usersData.map(async (userData) => {
            const hashedPassword = await bcrypt.hash(userData.password, 10); 
            return { ...userData, password: hashedPassword };
         })
         );
      
         // Use bulkCreate with the ignoreDuplicates option to ignore records with duplicate emails
         const users = await userModel.bulkCreate(hashedUsersData, {
         ignoreDuplicates: true, // Ignore records with duplicate email field since its unique
         validate: true
         });
         logger.info('POST: EXITING createUsers service method with no errors.');
         return users;
      } catch (error) {
         logger.error(`POST: EXITING createUsers service method with error -`,error);
         return Promise.reject(ApiError.serviceUnavailable("Service unavailable"))
      }
   }

   static findUserByEmail = async(email) =>{
      logger.info('GET: ENTERING findUserByEmail service method.');
      try{
         const user =  await userModel.findOne({where : {email : email}});
         logger.info('GET: EXITING findUserByEmail service method with no errors.');
         return user;
      }catch(error){
         logger.error(`GET: EXITING findUserByEmail service method with error -`,error);
         throw ApiError.serviceUnavailable('service unavailable');
      }
   }
}

module.exports = UserService;