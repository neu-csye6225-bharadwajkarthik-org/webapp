const fs = require('fs');
const dotenv = require('dotenv');
const SequelizeFactory = require("../../config/orm-config");
const ApiError = require('../../error/api-error')

const setSuccessResponse = (successJSON, statusCode, response)=>{
   response.status(statusCode);
   if(successJSON){
      response.json(successJSON);
   }
   response.end();
}

const setErrorResponse = (error, response)=>{
   response.status(error.code)
   response.json({"error" : error.msg});
   response.end()
}

const nameValidator = function (value) {
   if (!/^[A-Za-z ']*[A-Za-z][A-Za-z ']*$/.test(value)) {
     const errorMsg = 'name field must contain 1 or more letters and 0 or more spaces and apostrophes only';
     throw ApiError.badRequest(errorMsg)
   }
}

const updateEnvVars = (envConfigObj) =>{
   for (const key in envConfigObj) {
      process.env[key] = envConfigObj[key];
      console.log(`${key} : ${process.env[key]}`)
   }
}

 const watchAndUpdateEnvVariables = () =>{
   const callback = (event, filename) =>{
      console.log('INSIDE THE CALLBACK: event = ', event , 'filename = ', filename)
      if (event === 'change') {
         console.log('INSIDE CHANGE')
         console.log(`File '${filename}' changed. Reloading environment variables...`);
         // update EnvVariables
         try {
            const dotEnvFileContents = fs.readFileSync(`${filename}`)
            console.log('dotEnvFileContents = ', dotEnvFileContents)
            const envConfig = dotenv.parse(dotEnvFileContents);
            console.log('envConfig = ', envConfig)
            // console.log('AFTER REACHED')
            updateEnvVars(envConfig)
            console.log('update envVars Called');
            // console.log('Environment variables reloaded.');
            SequelizeFactory().update(); // update the sequelize instance
            console.log('update on factory called')
         } catch (error) {
            // console.log('IN HERE IN ERROR')
            console.error('error : ', error);
         }
      }
    }
   fs.watch('.env', callback);
 }

 module.exports = {
   setSuccessResponse,
   setErrorResponse,
   nameValidator,
   watchAndUpdateEnvVariables,
   updateEnvVars,
 }