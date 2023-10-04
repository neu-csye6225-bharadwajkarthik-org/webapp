const AssignmentService = require('../services/assignment-service');
const {setSuccessResponse} = require('../utils/helpers/non-crud')
const StatusCodes = require('../utils/status-codes')

class AssignmentController{
   
   static async createAssignment(req, res, next) {
      try {
        const userId = req.user.id; // Assuming we have user information from authentication
        const assignmentData = req.body; // assuming we are doing ajv validation on assignment schema
  
        const createdAssignment = await AssignmentService.createAssignment(userId, assignmentData);
        setSuccessResponse(createdAssignment, StatusCodes.CREATED, res)
      } catch (error) {
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async getAssignmentById(req, res, next) {
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignmentId = req.params.assignmentId;
        
        const assignment = await AssignmentService.getAssignmentById(userId, assignmentId);
        setSuccessResponse(assignment, StatusCodes.OK, res)
      } catch (error) {
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async getAllAssignmentsByUserId(req, res, next) {
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignments = await AssignmentService.getAllAssignments(userId);
  
        setSuccessResponse(assignments, StatusCodes.OK, res)
      } catch (error) {
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async deleteAssignmentById(req, res, next) {
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignmentId = req.params.assignmentId;
  
        await AssignmentService.deleteAssignmentById(userId, assignmentId);
  
        setSuccessResponse(null, StatusCodes.NO_CONTENT, res)
      } catch (error) {
        next(error); // Pass the error to the error handler middleware
      }
   }

   static async putAssignmentById(req, res, next) {
      try {
        const userId = req.user.id; // Assuming you have user information from authentication
        const assignmentData = req.body;
        assignmentData.id = req.params.assignmentId;
        
        await AssignmentService.putAssignmentById(userId, assignmentData);
  
        setSuccessResponse(null, StatusCodes.NO_CONTENT, res)
      } catch (error) {
        next(error); // Pass the error to the error handler middleware
      }
   }
}

module.exports = AssignmentController;