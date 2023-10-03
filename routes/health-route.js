const express = require('express');
const HealthController = require('../controllers/health-controller');
const MiddlewareAPI = require('../utils/middlewares');

const healthRouter = express.Router();

healthRouter.route('/healthz')
      .all(MiddlewareAPI.onlyAllowMethods(['GET']))
      .get(MiddlewareAPI.invalidateReqWithQueryParams,
            MiddlewareAPI.invalidateNonJSONReqPayload, 
            MiddlewareAPI.invalidateNonEmptyReqBody,
            HealthController.checkHealth)

module.exports = healthRouter;