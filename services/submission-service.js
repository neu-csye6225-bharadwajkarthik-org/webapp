const {submissionModel, userSubmissionModel} = require('../models/index')
const {AssignmentService} = require('./index')
const ApiError = require('../error/api-error');
const logger = require('../utils/logger');
const { Op } = require('sequelize');


class SubmissionService{

   static async createSubmission(userId, assignmentId, submissionUrl) {
      logger.info('POST: ENTERING createSubmission service method.');
      try {
         // Check and get assignment resource
         const assignment = await AssignmentService.getAssignmentById(userId, assignmentId);

         // Step 1: Get submissionIds for the given assignmentId
         const submissionIds = await submissionModel.findAll({
            attributes: ['id'],
            where: { assignment_id: assignmentId }
         });
         
         // Extract an array of submissionIds from the result
         const submissionIdsArray = submissionIds.map(submission => submission.id);
         
         // Step 2: Get UserSubmissions that match the userId and submissionIds
         const userSubmissions = await userSubmissionModel.findAll({
            where: {
            userId: userId,
            submissionId: {
               [Op.in]: submissionIdsArray
            }
            }
         });
         
         // Count the number of userSubmissions
         const existingSubmissionsCount = userSubmissions.length;

         console.log('existing submissions count : ', existingSubmissionsCount);

         // Check if submission limit reached
         if (existingSubmissionsCount >= assignment.num_of_attempts) {
            throw ApiError.badRequest("Maximum submission limit reached for this assignment");
         }

         // Check if deadline has passed
         const currentDate = new Date();
         if (assignment.deadline <= currentDate) {
            throw ApiError.badRequest("Assignment submission deadline has passed");
         }

         // Create the submission
         const createdSubmission = await submissionModel.create({
               assignment_id: assignmentId,
               submission_url: submissionUrl
         });

         // Create entry in User_Submissions linking the user to the submission
         await userSubmissionModel.create({
            userId: userId,
            submissionId: createdSubmission.id
         });

         logger.info('POST: EXITING createSubmission service method with no errors.');
         return createdSubmission;
      } catch (error) {
         logger.error(`POST: EXITING createSubmission service method with error -`,error);

         console.error('Error creating submission:', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError.serviceUnavailable("service unavailable")
      }
   }
}

module.exports = SubmissionService