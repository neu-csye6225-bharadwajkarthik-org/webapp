const SubmissionService = require('../services/submission-service');
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
      try {
        const userId = req.user.id; // Assuming we have user information from authentication
        const assignmentId = req.params.assignmentId; // get assignmentId from url
        const submissionUrl = req.body.submission_url; // assuming we are doing ajv validation on submission schema
        console.log('userId: ', userId);
        console.log('assignmentId: ', assignmentId);
        console.log('submissionUrl: ', submissionUrl);

        const createdSubmission = await SubmissionService.createSubmission(userId, assignmentId, submissionUrl);
        
        statsDClient.increment('endpoints.response.http.post.success.createAssignment');

        console.log('req.user.email : ', req.user.email)
        console.log('submission_url: ', submissionUrl)
        // Push to sns topic
        const params = {
         Message: JSON.stringify({email: req.user.email,
                                  submission_url: submissionUrl}),
         TopicArn: snsTopicArn,
       };
     
         sns.publish(params, (err, data) => {
            if (err) {
               logger.error('POST: Error publishing to SNS topic.');
               console.error("Error publishing message to SNS:", err);
            } else {
               console.log("Submission URL published to SNS:", data.MessageId);
               logger.info('POST: Successfully published message to SNS')
               logger.info('POST: EXITING createSubmission controller method with no errors')
            }
         });

        setSuccessResponse(createdSubmission, StatusCodes.CREATED, res)
      } catch (error) {
        statsDClient.increment('endpoints.response.http.post.failure.createSubmission');
        logger.error(`POST: EXITING createSubmission controller method with error - `,error);
        next(error); // Pass the error to the error handler middleware
      }
   }
}

module.exports = SubmissionController