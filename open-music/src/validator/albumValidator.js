const AlbumPayloadSchema = require('./schema/album');
const InvariantError = require('../exceptions/InvariantError');

const validateAlbumPayload = (payload) => {
  const validationResult = AlbumPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = { validateAlbumPayload };
