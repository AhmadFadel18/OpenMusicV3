const Jwt = require('@hapi/jwt');

const authenticationsPlugin = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { tokenManager }) => {
    server.auth.strategy('openmusic_jwt', 'jwt', {
      keys: process.env.ACCESS_TOKEN_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE || 3600,
      },
      validate: (artifacts) => {
        const { id } = artifacts.decoded.payload;
        if (!id) {
          return {
            isValid: false,
            credentials: {},
          };
        }
        return {
          isValid: true,
          credentials: { id },
        };
      },
    });
  },
};

module.exports = authenticationsPlugin;