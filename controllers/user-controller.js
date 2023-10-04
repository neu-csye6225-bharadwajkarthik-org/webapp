const UserService = require('../services/user-service')

class UserController{
   static createUsers = async(userData) => {
      try{
         return await UserService.createUsers(userData)
      }catch(error){
         console.log(`Error in User controller method in loading and creating users : `, error)
         throw error
      }     
   }

   static findUserByEmail = async(email) => {
      try{
         return await UserService.findUserByEmail(email)
      }catch(error){
         console.log(`Error in User Controller method in finding user by email : `, error)
         throw error
      }
   }
}

module.exports = UserController;