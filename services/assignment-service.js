const {assignmentModel,userAssignmentModel} = require('../models/index')
const ApiError = require('../error/api-error');

class AssignmentService{

   static async createAssignment(userId, assignmentData) {
      try {
        // Create a new assignment
        const createdAssignment = await assignmentModel.create(assignmentData);
  
        // Associate the assignment with the user in the UserAssignments table
        await userAssignmentModel.create({
          userId: userId,
          assignmentId: createdAssignment.id, // Use the ID of the created assignment
        });
  
        return createdAssignment;
      } catch (error) {
        console.error('Error creating and associating assignment:', error);
        if(error instanceof ApiError)
            throw error
         else
            throw ApiError('service unavailable')
      }
   }

   static async getAssignmentById(userId, assignmentId) {
      try {
        // Fetch the assignment by its ID
        const assignment = await assignmentModel.findByPk(assignmentId);
        console.log('assignment found by pk = ', assignment)

        if (!assignment) {
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
          throw ApiError.forbidden('unauthorized to access assignment resource');
        }
  
        return assignment;
      } catch (error) {
        console.error('Error fetching assignment by ID:', error);
        if(error instanceof ApiError)
            throw error
         else
            throw ApiError('service unavailable')
      }
    }

   static async getAllAssignmentsByUserIdWithFilters(userId, filter) {
      try {
        // Fetch assignment IDs associated with the user and apply the filter
         const assignmentIdsObjectArray = await userAssignmentModel.findAll({
            attributes: ['assignmentId'],
            where: {
               userId: userId
            },
         });

         // Map assignment IDs to assignment details
         const assignmentIds = assignmentIdsObjectArray.map((assignmentIdsObject) => assignmentIdsObject.assignmentId)

         const assignmentFilter = {
            id: assignmentIds, // Filter by assignment IDs associated with the user
            ...filter, // Apply additional filters from the query parameters
          };
          
          // Fetch assignments based on the filter
          const assignments = await assignmentModel.findAll({
            where: assignmentFilter,
          });

          return assignments;
      }catch (error) {
         console.error('Error fetching all assignments:', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError('service unavailable')
      }
    }


   static async deleteAssignmentById(userId, assignmentId) {
      try {
         const assignment = await assignmentModel.findByPk(assignmentId);

         if (!assignment) {
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

      } catch (error) {
         console.error('Error deleting assignment or user-assignment object :', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError('service unavailable')
      }
   }

   static async putAssignmentById(userId, assignmentData) {
      try {
         const assignmentId = assignmentData.id
         const assignment = await assignmentModel.findByPk(assignmentId);

         if (!assignment) {
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
            throw ApiError.forbidden('unauthorized to update assignment resource.');
         }

         // Update the assignment
         await assignmentModel.update(assignmentData, {
            where: {
            id: assignmentId,
            },
         });

      } catch (error) {
         console.error('Error updating assignment by ID:', error);
         if(error instanceof ApiError)
            throw error
         else
            throw ApiError('service unavailable')
      }
   }

}

module.exports = AssignmentService