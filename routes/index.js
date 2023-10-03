const healthRouter = require('./health-route');
const assignmentRouter = require('./assignment-route')

const routes = (app) =>{
   // attach routes to app
   app.use('/', healthRouter)
   app.use('/', assignmentRouter)
}

module.exports = routes;