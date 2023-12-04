require('dotenv').config();
const models = require('./models/index')
const app = require('./app');
const {watchAndUpdateEnvVariables} = require('./utils/helpers/non-crud');
const {createUsersFromCsv} = require('./utils/helpers/crud')

function sleep(ms) {
   return new Promise(resolve => {
     setTimeout(resolve, ms);
   });
 }

// Monitor and reload env vars
const startServer = async() =>{
   try{
      await sleep(1500)
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
