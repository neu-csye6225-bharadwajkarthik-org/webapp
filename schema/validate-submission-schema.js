const ajvInstance = require('./ajv-instance.js');
const submissionSchema = require('./submission-schema.json');

module.exports = ajvInstance.compile(submissionSchema)