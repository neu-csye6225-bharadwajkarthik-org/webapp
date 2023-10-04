const ajvInstance = require('./ajv-instance.js');
const assignmentSchema = require('./assignment-schema.json');

module.exports = ajvInstance.compile(assignmentSchema)