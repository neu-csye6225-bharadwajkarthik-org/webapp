require('dotenv').config();
const app = require('./app');
const {watchAndUpdateEnvVariables} = require('./utils/helpers/non-crud');
const {createUsersFromCsv} = require('./utils/helpers/crud')
// Monitor and reload env vars
const startServer = async() =>{
   try{
      watchAndUpdateEnvVariables()
      const USERS_CSV_PATH = process.env.USERS_CSV_PATH
      console.log(`USERS_CSV_PATH = ${USERS_CSV_PATH}`)
      await createUsersFromCsv(USERS_CSV_PATH)

      const APP_PORT = process.env.APP_PORT
      app.listen(APP_PORT, () =>{
         console.log(`Listening on port : ${APP_PORT}`);
      })
   }catch(error){
      console.log("error caught in server.js catch: ", error)
   }
}

startServer()
