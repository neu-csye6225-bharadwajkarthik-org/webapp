const AssignmentService = require('../services/assignment-service');
const {setSuccessResponse} = require('../utils/helpers/non-crud')
const StatusCodes = require('../utils/status-codes')
const logger = require('../utils/logger');
const statsDClient = require('../utils/metrics');
class AssignmentController{
   
   static async createAssignment(req, res, next) {
      statsDClient.increment('endpoints.request.http.post.createAssignment');
      logger.info('POST: ENTERING createAssignment controller method.');
      try {
        const userId = req.user.id; // Assuming we have user information from authentication
        const assignmentData = req.body; // assuming we are doing ajv validation on assignment schema
  
        const createdAssignment = await AssignmentService.createAssignment(userId, assignmentData);
        logger.info('POST: EXITING createAssignment controller method with no errors.');
        statsDClient.increment('endpoints.response.http.post.success.createAssignment');
        setSuccessResponse(createdAssignment, StatusCodes.CREATED, res)
      } catch (error) {
        statsDClient.increment('endpoints.response.http.post.failure.createAssignment');
        logger.error(`POST: EXITING createAssignment controller method with error - `,error);
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async getAssignmentById(req, res, next) {
      logger.info('GET: ENTERING getAssignmentById controller method.');
      statsDClient.increment('endpoints.request.http.get.getAssignmentById');
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignmentId = req.params.assignmentId;
        
        const assignment = await AssignmentService.getAssignmentById(userId, assignmentId);
        logger.info('GET: EXITING getAssignmentById controller method with no errors.');
        statsDClient.increment('endpoints.response.http.get.success.getAssignmentById');
        setSuccessResponse(assignment, StatusCodes.OK, res)
      } catch (error) {
        statsDClient.increment('endpoints.response.http.get.failure.getAssignmentById');
        logger.error(`GET: EXITING getAssignmentById controller method with error - `,error);
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async getAllAssignmentsByUserId(req, res, next) {
      logger.info('GET: ENTERING getAllAssignmentsByUserId controller method.');
      statsDClient.increment('endpoints.request.http.get.getAllAssignmentsByUserId');
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignments = await AssignmentService.getAllAssignments(userId);
        logger.info('GET: EXITING getAllAssignmentsByUserId controller method with no errors.');
        statsDClient.increment('endpoints.response.http.get.success.getAllAssignmentsByUserId');
        setSuccessResponse(assignments, StatusCodes.OK, res)
      } catch (error) {
        logger.error(`GET: EXITING getAllAssignmentsByUserId controller method with error -`,error);
        statsDClient.increment('endpoints.response.http.get.failure.getAllAssignmentsByUserId');
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async deleteAssignmentById(req, res, next) {
      logger.info('DELETE: ENTERING deleteAssignmentById controller method.');
      statsDClient.increment('endpoints.request.http.delete.deleteAssignmentById');
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignmentId = req.params.assignmentId;
  
        await AssignmentService.deleteAssignmentById(userId, assignmentId);
        logger.info('DELETE: EXITING deleteAssignmentById controller method with no errors.');
        statsDClient.increment('endpoints.response.http.delete.success.deleteAssignmentById');
        setSuccessResponse(null, StatusCodes.NO_CONTENT, res)
      } catch (error) {
        logger.error(`DELETE: EXITING deleteAssignmentById controller method with error -`,error);
        statsDClient.increment('endpoints.response.http.delete.failure.deleteAssignmentById');
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async putAssignmentById(req, res, next) {
      logger.info('PUT: ENTERING putAssignmentById controller method.');
      statsDClient.increment('endpoints.request.http.put.putAssignmentById');
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignmentData = req.body;
        assignmentData.id = req.params.assignmentId;
        
        await AssignmentService.putAssignmentById(userId, assignmentData);
        logger.info('PUT: EXITING putAssignmentById controller method with no errors.');
        statsDClient.increment('endpoints.response.http.put.success.putAssignmentById');
        setSuccessResponse(null, StatusCodes.NO_CONTENT, res)
      } catch (error) {
        statsDClient.increment('endpoints.response.http.put.failure.putAssignmentById');
        logger.error(`PUT: EXITING putAssignmentById controller method with error -`,error);
        next(error); // Pass the error to the error handler middleware
      }
   }
}

module.exports = AssignmentController;