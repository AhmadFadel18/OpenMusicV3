const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

function validatePostAuthenticationPayload(payload) {
  const result = PostAuthenticationPayloadSchema.validate(payload);
  if (result.error) {
    throw new InvariantError(result.error.message);
  }
}

function validatePutAuthenticationPayload(payload) {
  const result = PutAuthenticationPayloadSchema.validate(payload);
  if (result.error) {
    throw new InvariantError(result.error.message);
  }
}

function validateDeleteAuthenticationPayload(payload) {
  const result = DeleteAuthenticationPayloadSchema.validate(payload);
  if (result.error) {
    throw new InvariantError(result.error.message);
  }
}

module.exports = {
  validatePostAuthenticationPayload,
  validatePutAuthenticationPayload,
  validateDeleteAuthenticationPayload,
};
