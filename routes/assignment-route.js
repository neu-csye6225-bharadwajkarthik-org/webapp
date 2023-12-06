const express = require('express');
const {AssignmentController,SubmissionController} = require('../controllers/index');
const MiddlewareAPI = require('../utils/middlewares');
const {validateAssignmentSchema, validateSubmissionSchema} = require('../schema/index')

const assignmentRouter = express.Router();

assignmentRouter.route('/demo/assignments')
      .all(MiddlewareAPI.onlyAllowMethods(['GET', 'POST']),
            MiddlewareAPI.invalidateReqWithQueryParams,
            MiddlewareAPI.invalidateNonJSONReqPayload,)
      .post(MiddlewareAPI.validateDTO(validateAssignmentSchema),
            MiddlewareAPI.tokenBasedAuthentication.BASIC,
            AssignmentController.createAssignment)
      .get(MiddlewareAPI.invalidateNonEmptyReqBody,
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.getAllAssignmentsByUserId)

assignmentRouter.route('/demo/assignments/:assignmentId/submissions')
      .all(MiddlewareAPI.onlyAllowMethods(['POST']),
           MiddlewareAPI.invalidateReqWithQueryParams,
           MiddlewareAPI.invalidateNonJSONReqPayload,)
      .post(MiddlewareAPI.validateDTO(validateSubmissionSchema),
            MiddlewareAPI.tokenBasedAuthentication.BASIC,
            SubmissionController.createSubmission)
            
assignmentRouter.route('/demo/assignments/:assignmentId')
      .all(MiddlewareAPI.onlyAllowMethods(['PUT', 'DELETE', 'GET']),
           MiddlewareAPI.invalidateReqWithQueryParams,
           MiddlewareAPI.invalidateNonJSONReqPayload,)
      .get(MiddlewareAPI.invalidateNonEmptyReqBody,
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.getAssignmentById)
      .put(MiddlewareAPI.validateDTO(validateAssignmentSchema),
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.putAssignmentById)
      .delete(MiddlewareAPI.invalidateNonEmptyReqBody,
            MiddlewareAPI.tokenBasedAuthentication.BASIC,
            AssignmentController.deleteAssignmentById)

module.exports = assignmentRouter;