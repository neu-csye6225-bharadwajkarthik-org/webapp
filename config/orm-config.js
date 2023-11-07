const {Sequelize} = require('sequelize');
const ApiError = require('../error/api-error')
// const HelperFunctions = require('../utils/helperFunctions.js');
const logger = require('../utils/logger');


//configure ORM with db settings and make publicly available
const SequelizeFactory = () =>{
   let sequelizeInstance = createNewSequelizeInstance(); // initial value of instance

   // private helper function; returns a new sequelizeInstance with .env config at call time
   function createNewSequelizeInstance(){
      console.log(`IN CREATE NEW SEQUELIZE INSTANCE : 
      process.env.DB = ${process.env.DB}
      process.env.DB_USERNAME = ${process.env.DB_USERNAME}
      process.env.DB_PASSWORD = ${process.env.DB_PASSWORD}
      process.env.DB_DIALECT = ${process.env.DB_DIALECT}
      process.env.HOST = ${process.env.HOST}
      process.env.DB_POOL_MIN = ${process.env.DB_POOL_MIN}
      process.env.DB_POOL_MAX = ${process.env.DB_POOL_MAX}
      process.env.DB_POOL_IDLE = ${process.env.DB_POOL_IDLE}
      process.env.DB_POOL_ACQUIRE = ${process.env.DB_POOL_ACQUIRE}`)
      try{
         const newInstance = new Sequelize(
            process.env.DB,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
         
            {
               host : process.env.HOST,
               dialect : process.env.DB_DIALECT,
               pool :{
                  min: Number.parseInt(process.env.DB_POOL_MIN),
                  max: Number.parseInt(process.env.DB_POOL_MAX),
                  acquire: Number.parseInt(process.env.DB_POOL_ACQUIRE),
                  idle: Number.parseInt(process.env.DB_POOL_IDLE),
               }
            }
         )
         return newInstance;
      }catch(error){
         logger.error(`ORM : Error updating sequelize instance with config - `,error);
         console.log("in error of create seq instance error : ", error)
         return null;
      }
   }

   return { // closures for getter/setter of sequelize instance
      get : () =>{ // public getter of sequelize instance
         if(sequelizeInstance === null){
            logger.error(`ORM : Error getting sequelize instance.`);
            throw ApiError.serviceUnavailable("service unavailable");
         }
         return sequelizeInstance;
      }, // public  of sequelize instance
      update : () =>{
         sequelizeInstance = createNewSequelizeInstance() // public setter of sequelize instance; called when .env file updated
      }
   }

   
}

   
module.exports = SequelizeFactory

