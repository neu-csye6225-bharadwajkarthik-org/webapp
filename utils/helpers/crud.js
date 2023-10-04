const fs = require('fs');
const csv = require('csv-parser')
const UserController = require('../../controllers/user-controller')
const ApiError = require('../../error/api-error')
const bcrypt = require('bcrypt')

const createUsersFromCsv = async(usersCsvPath) =>{
   try{
      // Create an array to store user data from the CSV file
      const userData = [];

      fs.createReadStream(usersCsvPath)
      .pipe(csv())
      .on('data', (row, index) => {
         // Skip the first row (index 0) with headers
         if (index === 0) {
            return;
         }
         // Process each row and add it to the userData array
         userData.push({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            password: row.password, // You should hash or encrypt the password here
         });
      })
      .on('end', async() => {
         // At this point, userData array contains user data from the CSV file, excluding the header row
         console.log('Users data before calling serveice method to push : ', userData);
         await UserController.createUsers(userData)
      });
   }catch(error){
      console.log("Encountered error in user load from csv...")
      console.error(error)
   }
 }

 const verifyUserCredentialsInDB = async(username, password) =>{
   try{
      // Fetch the user's hashed password from the database
      let user = (await UserController.findUserByEmail(username));

      if (!user) {
         // User not found
         throw ApiError.unauthorized("User with entered username does not exist")
      }

      user = user.toJSON();
      console.log('user : ', user)
      console.log('password = ', password)
      // Compare the entered password in header with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if(!passwordMatch){
         console.log("in mismatch password in verifyUserCredentials")
         throw ApiError.unauthorized("Invalid password")
      }
      // password matches => user is authenticated, return user
      return user;
   }catch(error){
      console.log("in catch of basic auth")
      // Handle any errors that occur during the database operation
      throw error;
   }
}

 module.exports = {
   createUsersFromCsv,
   verifyUserCredentialsInDB
 }