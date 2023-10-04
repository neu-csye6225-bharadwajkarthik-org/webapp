const ApiError = require('../error/api-error');
const { userModel } = require('../models/index');
const bcrypt = require('bcrypt');

class UserService {
   static createUsers = async (usersData) => {
      try {
         // Hash passwords before adding users
         const hashedUsersData = await Promise.all(
         usersData.map(async (userData) => {
            const hashedPassword = await bcrypt.hash(userData.password, 10); 
            return { ...userData, password: hashedPassword };
         })
         );
      
         // Use bulkCreate with the ignoreDuplicates option to ignore records with duplicate emails
         return await userModel.bulkCreate(hashedUsersData, {
         ignoreDuplicates: true, // Ignore records with duplicate email field since its unique
         validate: true
         });
      } catch (error) {
         return Promise.reject(ApiError.serviceUnavailable("Service unavailable"))
      }
   }

   static findUserByEmail = async(email) =>{
      try{
         return await userModel.findOne({where : {email : email}});
      }catch(error){
         throw ApiError.serviceUnavailable('service unavailable');
      }
   }
}

module.exports = UserService;