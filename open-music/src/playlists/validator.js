const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

function validatePlaylistPayload(payload) {
  const result = PlaylistPayloadSchema.validate(payload);
  if (result.error) throw new InvariantError(result.error.message);
}

function validatePlaylistSongPayload(payload) {
  const result = PlaylistSongPayloadSchema.validate(payload);
  if (result.error) throw new InvariantError(result.error.message);
}

module.exports = {
  validatePlaylistPayload,
  validatePlaylistSongPayload,
};