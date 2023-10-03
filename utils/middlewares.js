const ApiError = require('../error/api-error')
const {verifyUserCredentialsInDB} = require('./helpers/crud')

const invalidateNonJSONReqPayload = (req, res , next) => {
   const contentType = req.headers['content-type'] || 'application/json';
   if(contentType !== 'application/json'){
      next(ApiError.badRequest("Non-JSON payload not allowed"))
   }
   next();
}

const invalidateNonEmptyReqBody = (req ,res ,next) =>{
   // console.log('in invalidateNonEmptyBody middleware : req = ', req);
   if(Object.keys(req.body).length !== 0){
      next(ApiError.badRequest("Non-Empty payload not allowed for this endpoint"));
   }else
      next();
}
const invalidateReqWithQueryParams = (req, res, next) => {
   // Check if the request has query parameters
   if (Object.keys(req.query).length > 0) {
     // Pass the error to the next middleware
     return next(ApiError.badRequest("Non-Empty query parameters not allowed for this endpoint"));
   }

   // If no query parameters are present, continue to the next middleware
   next();
 }
 
 const onlyAllowMethods = (allowedMethods) => {
   return (req, res, next) => {
     const requestMethod = req.method.toUpperCase(); // Convert to uppercase
     if (!allowedMethods.includes(requestMethod)) {
      console.log('req method = ', requestMethod)
       next(ApiError.notAllowed(`HTTP Method - ${requestMethod} - not allowed for this endpoint`));
       return; // Exit early when the method is not allowed
     }
     next(); // Continue processing if the method is allowed
   };
 };
 



// Middleware to set no-cache headers
const removeCacheFromResponse = (req, res, next) => {
   // Set Cache-Control headers to specify no caching
   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
   res.setHeader('Pragma', 'no-cache');
   next();
 };

const tokenBasedAuthentication = {
   BASIC : async(req, res, next) => {
       try{
         const authHeader = req.headers.authorization; // Extract basic authorization header and decode it
         if (!authHeader || !authHeader.startsWith('Basic ')) { // authorization not provided or not supported : 
            if(authHeader)
             throw ApiError.unauthorized("Only Basic authentication supported");
           else
             throw ApiError.unauthorized("Authorization header is required");
         }
     
         const base64Credentials = authHeader.split(' ')[1];
         const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
         const [username, password] = credentials.split(':');
         
         if(!username || !password){
           throw ApiError.unauthorized("Authentication credentials not provided");
         }
 
         let user = await verifyUserCredentialsInDB(username, password); // return false if invalid credentials, else return authenticated user 
         req.user = user; // store fetched authenticated user in request and go to next middleware
         next();
       }catch(error){
         next(error)
       }
   }
}

const validateDTO = (validateSchema) =>{
   return (req, res, next) => {
      const valid = validateSchema(req.body);
      if(!valid){
         const errors = validateSchema.errors;
          next(ApiError.badRequest(errors))
      }
      next()
   }
}

module.exports = {
   invalidateReqWithQueryParams,
   invalidateNonEmptyReqBody,
   invalidateNonJSONReqPayload,
   removeCacheFromResponse,
   onlyAllowMethods,
   tokenBasedAuthentication,
   validateDTO
}