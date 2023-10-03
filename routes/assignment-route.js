const express = require('express');
const AssignmentController = require('../controllers/assignment-controller');
const MiddlewareAPI = require('../utils/middlewares');
const validateAssignmentSchema = require('../schema/validate-assignment-schema')

const assignmentRouter = express.Router();

assignmentRouter.route('/v1/assignments')
      .all(MiddlewareAPI.onlyAllowMethods(['GET', 'POST']))
      .post(MiddlewareAPI.invalidateReqWithQueryParams,
            MiddlewareAPI.invalidateNonJSONReqPayload,
            MiddlewareAPI.validateDTO(validateAssignmentSchema),
            MiddlewareAPI.tokenBasedAuthentication.BASIC,
            AssignmentController.createAssignment)
      .get(MiddlewareAPI.invalidateNonJSONReqPayload,
           MiddlewareAPI.invalidateNonEmptyReqBody,
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.getAllAssignmentsByUserId)

assignmentRouter.route('/v1/assignments/:assignmentId')
      .all(MiddlewareAPI.onlyAllowMethods(['PUT', 'DELETE', 'GET']))
      .get(MiddlewareAPI.invalidateReqWithQueryParams,
           MiddlewareAPI.invalidateNonJSONReqPayload,
           MiddlewareAPI.invalidateNonEmptyReqBody,
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.getAssignmentById)
      .put(MiddlewareAPI.invalidateReqWithQueryParams,
           MiddlewareAPI.invalidateNonJSONReqPayload,
           MiddlewareAPI.validateDTO(validateAssignmentSchema),
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.putAssignmentById)
      .delete(MiddlewareAPI.invalidateReqWithQueryParams,
            MiddlewareAPI.invalidateNonJSONReqPayload,
            MiddlewareAPI.invalidateNonEmptyReqBody,
            MiddlewareAPI.tokenBasedAuthentication.BASIC,
            AssignmentController.deleteAssignmentById)
module.exports = assignmentRouter;