const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

function validateAlbumPayload(payload) {
  const result = AlbumPayloadSchema.validate(payload);
  if (result.error) {
    throw new InvariantError(result.error.message);
  }
}

module.exports = { validateAlbumPayload };
