const {SubmissionService,AssignmentService} = require('../services/index');
const {setSuccessResponse} = require('../utils/helpers/non-crud')
const StatusCodes = require('../utils/status-codes')
const logger = require('../utils/logger');
const statsDClient = require('../utils/metrics');
const AWS = require('aws-sdk');

// Configure AWS credentials (assuming the EC2 instance has necessary permissions)
AWS.config.update({
   region: process.env['AWS_REGION'], 
});
// Create SNS service object
const sns = new AWS.SNS();

// ARN of your SNS topic
const snsTopicArn = process.env['SNS_TOPIC_ARN'];

class SubmissionController{
   
   static async createSubmission(req, res, next) {
      statsDClient.increment('endpoints.request.http.post.createSubmission');
      logger.info('POST: ENTERING createSubmission controller method.');
      const userId = req.user.id; // Assuming we have user information from authentication
      const assignmentId = req.params.assignmentId; // get assignmentId from url
      const submissionUrl = req.body.submission_url; // assuming we are doing ajv validation on submission schema
      console.log('userId: ', userId);
      console.log('assignmentId: ', assignmentId);
      console.log('submissionUrl: ', submissionUrl)
      let assignment;
      try{
         assignment = await AssignmentService.getAssignmentById(userId, assignmentId) 
      }catch(err){
         next(err)
         return;
      }
      console.log('assignment = ', assignment)
      try {
        let createdSubmission;
        let SUBMISSION_ERROR = undefined;
        try{
            createdSubmission = await SubmissionService.createSubmission(userId, assignmentId, submissionUrl);
        }catch(err){
         console.log('in created submission err : ', err)
            SUBMISSION_ERROR = err
        }

        console.log('createdSubmission :', createdSubmission)

        console.log('req.user.email : ', req.user.email)
        console.log('submission_url: ', submissionUrl)
        console.log('userId = ', userId);
        console.log('assignmentId = ', assignmentId);
        console.log('submissionId = ', (!SUBMISSION_ERROR ? createdSubmission.id : 'NA'));
        // Push to sns topic
        const params = {
         Message: JSON.stringify({email: req.user.email,
                                  submission_url: submissionUrl,
                                 userId: userId,
                                 assignmentId: assignmentId,
                                 submissionId: SUBMISSION_ERROR ? 'NA' : createdSubmission.id,
                                 SUBMISSION_ERROR: SUBMISSION_ERROR
                              }),
         TopicArn: snsTopicArn,
       };
     
         sns.publish(params, (err, data) => {
            if (err) {
               logger.error('POST: Error publishing to SNS topic.');
               console.error("Error publishing message to SNS:", err);
            } else {
               console.log("Submission URL published to SNS:", data.MessageId);
               logger.info('POST: Successfully published message to SNS')
            }
         });

        if(SUBMISSION_ERROR)
            throw SUBMISSION_ERROR
         
        logger.info('POST: EXITING createSubmission controller method with no errors')
        statsDClient.increment('endpoints.response.http.post.success.createAssignment');
        setSuccessResponse(createdSubmission, StatusCodes.CREATED, res)
      } catch (error) {
        statsDClient.increment('endpoints.response.http.post.failure.createSubmission');
        logger.error(`POST: EXITING createSubmission controller method with error - `,error);
        next(error); // Pass the error to the error handler middleware
      }
   }
}

module.exports = SubmissionController