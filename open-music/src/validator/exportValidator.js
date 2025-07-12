const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

function validateExportPayload(payload) {
  const result = ExportPayloadSchema.validate(payload);
  if (result.error) {
    throw new InvariantError(result.error.message);
  }
}

module.exports = { validateExportPayload };
