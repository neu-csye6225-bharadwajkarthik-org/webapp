const {assignmentModel,userAssignmentModel} = require('../models/index')
const ApiError = require('../error/api-error');
const logger = require('../utils/logger');
class AssignmentService{

   static async createAssignment(userId, assignmentData) {
      logger.info('POST: ENTERING createAssignment service method.');
      try {
        // Create a new assignment
        const createdAssignment = await assignmentModel.create(assignmentData);
  
        // Associate the assignment with the user in the UserAssignments table
        await userAssignmentModel.create({
          userId: userId,
          assignmentId: createdAssignment.id, // Use the ID of the created assignment
        });
        logger.info('POST: EXITING createAssignment service method with no errors.');
        return createdAssignment;
      } catch (error) {
         logger.error(`POST: EXITING createAssignment service method with error -`,error);

        console.error('Error creating and associating assignment:', error);
        if(error instanceof ApiError)
            throw error
         else
            throw ApiError.serviceUnavailable("service unavailable")
      }
   }

   static async getAssignmentById(userId, assignmentId) {
      logger.info('GET: ENTERING getAssignmentById service method.');
      try {
        // Fetch the assignment by its ID
        const assignment = await assignmentModel.findByPk(assignmentId);
        console.log('assignment found by pk = ', assignment)

        if (!assignment) {
          logger.error('GET: EXITING getAssignmentById service method with error - Assignment resource not found');
          throw ApiError.notFound("Assignment resource not found")
        }

        // Check if the assignment is associated with the user
        const userAssignment = await userAssignmentModel.findOne({
          where: {
            userId: userId,
            assignmentId: assignmentId,
          },
        });
  
        if (!userAssignment) {
          logger.error('GET: EXITING getAssignmentById service method with error - unauthorized to access assignment resource');
          throw ApiError.forbidden('unauthorized to access assignment resource');
        }
        logger.info('GET: EXITING getAssignmentById service method with no errors.');
        return assignment;
      } catch (error) {
         logger.error('GET: EXITING getAssignmentById service method with error - ', error);
        console.error('Error fetching assignment by ID:', error);
        if(error instanceof ApiError)
            throw error
         else
            throw ApiError.serviceUnavailable("service unavailable")
      }
    }

   static async getAllAssignments(userId) {
      logger.info('GET: ENTERING getAllAssignments service method.');
      try {
         const assignmentIdsObjectArray = await userAssignmentModel.findAll({
            attributes: ['assignmentId'],
            where: {
               userId: userId
            },
         });

         const assignments = await assignmentModel.findAll({
            where: {
               id : assignmentIdsObjectArray.map(assignmentIdObject => assignmentIdObject.assignmentId)
            }
         })
         logger.info('GET: EXITING getAllAssignments service method with no errors.');
         return assignments;
      }catch (error) {
         logger.error('GET: EXITING getAllAssignments service method with error - ', error);
         console.error('Error fetching all assignments:', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError.serviceUnavailable("service unavailable")
      }
    }


   static async deleteAssignmentById(userId, assignmentId) {
      logger.info('DELETE: ENTERING deleteAssignmentById service method.');
      try {
         const assignment = await assignmentModel.findByPk(assignmentId);

         if (!assignment) {
            logger.error('DELETE: EXITING deleteAssignmentById service method with error - Assignment resource not found');
            throw ApiError.notFound("Assignment resource not found")
         }
         // Check if the assignment is associated with the user
         const userAssignment = await userAssignmentModel.findOne({
            where: {
               userId: userId,
               assignmentId: assignmentId,
            },
         });

         if (!userAssignment) {
            logger.error('DELETE: EXITING deleteAssignmentById service method with error - unauthorized to delete assignment resource');
            throw ApiError.forbidden('unauthorized to delete assignment resource.');
         }

         // Delete the assignment
         await assignmentModel.destroy({
            where: {
               id: assignmentId,
            },
         });

         // Delete the UserAssignments association
         await userAssignmentModel.destroy({
            where: {
            userId: userId,
            assignmentId: assignmentId,
            },
         });
         logger.info('DELETE: EXITING deleteAssignmentById service method with no errors.');
      } catch (error) {
         logger.error('DELETE: EXITING deleteAssignmentById service method with error - ',error);
         console.error('Error deleting assignment or user-assignment object :', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError.serviceUnavailable("service unavailable")
      }
   }

   static async putAssignmentById(userId, assignmentData) {
      logger.info('PUT: ENTERING putAssignmentById service method.');
      try {
         const assignmentId = assignmentData.id
         const assignment = await assignmentModel.findByPk(assignmentId);

         if (!assignment) {
            logger.error('PUT: EXITING putAssignmentById service method with error - Assignment resource not found');
            throw ApiError.notFound("Assignment resource not found")
         }
         // Check if the assignment is associated with the user
         const userAssignment = await userAssignmentModel.findOne({
            where: {
            userId: userId,
            assignmentId: assignmentId,
            },
         });

         if (!userAssignment) {
            logger.error('PUT: EXITING putAssignmentById service method with error - unauthorized to update assignment resource');
            throw ApiError.forbidden('unauthorized to update assignment resource.');
         }

         // Update the assignment
         await assignmentModel.update(assignmentData, {
            where: {
            id: assignmentId,
            },
         });
         logger.info('PUT: EXITING putAssignmentById service method with no errors.');
      } catch (error) {
         logger.error('PUT: EXITING putAssignmentById service method with error - ', error);
         console.error('Error updating assignment by ID:', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError.serviceUnavailable("service unavailable")
      }
   }

}

module.exports = AssignmentService