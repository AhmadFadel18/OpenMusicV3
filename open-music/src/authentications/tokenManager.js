const Jwt = require('@hapi/jwt');

const TokenManager = {
  generateAccessToken: ({ id }) =>
    Jwt.token.generate({ id }, process.env.ACCESS_TOKEN_KEY),

  generateRefreshToken: ({ id }) =>
    Jwt.token.generate({ id }, process.env.REFRESH_TOKEN_KEY),

  verifyAccessToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verify(artifacts, process.env.ACCESS_TOKEN_KEY);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new Error('Access token tidak valid');
    }
  },

  verifyRefreshToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new Error('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;