const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'InvariantError';
    this.statusCode = statusCode;
  }
}

module.exports = InvariantError;
