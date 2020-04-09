module.exports.validationException = {
  status: 400,
  code: 'VALIDATION_ERRORS',
  message: 'Request has validation errors',
  stack: {
    sampleField: {
      summary: 'Summary message for sample field',
      inline: 'Inline message for sample field'
    }
  }
};

module.exports.serviceException = {
  statusCode: 405,
  message: 'Service error message',
  stack: {}
};

module.exports.genericServerException = {
  status: 500,
  message: 'Generic erver error message',
  stack: {}
};

module.exports.exceptionWithNoStatus = {
  message: 'Error message with no status',
  stack: {}
};
