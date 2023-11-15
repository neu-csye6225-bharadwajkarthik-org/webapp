const express = require('express');
const AssignmentController = require('../controllers/assignment-controller');
const MiddlewareAPI = require('../utils/middlewares');
const validateAssignmentSchema = require('../schema/validate-assignment-schema')

const assignmentRouter = express.Router();

assignmentRouter.route('/assignments')
      .all(MiddlewareAPI.onlyAllowMethods(['GET', 'POST']),
            MiddlewareAPI.invalidateReqWithQueryParams,
            MiddlewareAPI.invalidateNonJSONReqPayload,)
      .post(MiddlewareAPI.validateDTO(validateAssignmentSchema),
            MiddlewareAPI.tokenBasedAuthentication.BASIC,
            AssignmentController.createAssignment)
      .get(MiddlewareAPI.invalidateNonEmptyReqBody,
           MiddlewareAPI.tokenBasedAuthentication.BASIC,
           AssignmentController.getAllAssignmentsByUserId)

assignmentRouter.route('/assignments/:assignmentId')
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