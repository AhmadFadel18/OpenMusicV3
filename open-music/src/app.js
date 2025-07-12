require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Exceptions
const ClientError = require('./exceptions/ClientError');

// External Config
const config = require('./utils/config');

// Services
const AlbumsService = require('./albums/service');
const SongsService = require('./songs/service');
const UsersService = require('./users/service');
const AuthenticationsService = require('./authentications/service');
const PlaylistsService = require('./playlists/service');
const StorageService = require('./storage/service');
const CacheService = require('./cache/RedisCacheService');
const AlbumLikesService = require('./albums/likesService');

// Export Producer
const ProducerService = require('./exports/producerService');

// Validators
const { validateAlbumPayload } = require('./validator/albumValidator');
const { validateSongPayload } = require('./validator/songValidator');
const { validateUserPayload } = require('./validator/userValidator');
const {
  validatePostAuthenticationPayload,
  validatePutAuthenticationPayload,
  validateDeleteAuthenticationPayload,
} = require('./validator/authValidator');
const {
  validatePlaylistPayload,
  validatePlaylistSongPayload,
} = require('./validator/playlistValidator');
const { validateExportPayload } = require('./validator/exportValidator');

// Token Manager
const TokenManager = require('./authentications/tokenManager');

// Handlers
const AlbumsHandler = require('./albums/handler');
const SongsHandler = require('./songs/handler');
const UsersHandler = require('./users/handler');
const AuthenticationsHandler = require('./authentications/handler');
const PlaylistsHandler = require('./playlists/handler');
const UploadsHandler = require('./uploads/handler');
const ExportsHandler = require('./exports/handler');

// Routes
const albumRoutes = require('./albums/routes');
const songRoutes = require('./songs/routes');
const userRoutes = require('./users/routes');
const authenticationRoutes = require('./authentications/routes');
const playlistRoutes = require('./playlists/routes');
const uploadsRoutes = require('./uploads/routes');
const exportsRoutes = require('./exports/routes');

const init = async () => {
  const server = Hapi.server({
    port: config.app.port || 5000,
    host: config.app.host || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register plugin
  await server.register([
    Jwt,
    Inert,
  ]);

  // Define JWT strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  // Inisialisasi services
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file'));
  const albumLikesService = new AlbumLikesService(cacheService);
  const playlistsService = new PlaylistsService(songsService);

  // Inisialisasi handlers
  const albumsHandler = new AlbumsHandler(albumsService, storageService, albumLikesService, {
    validateAlbumPayload,
  });
  const songsHandler = new SongsHandler(songsService, { validateSongPayload });
  const usersHandler = new UsersHandler(usersService, { validateUserPayload });
  const authenticationsHandler = new AuthenticationsHandler(
    authenticationsService,
    usersService,
    TokenManager,
    {
      validatePostAuthenticationPayload,
      validatePutAuthenticationPayload,
      validateDeleteAuthenticationPayload,
    }
  );
  const playlistsHandler = new PlaylistsHandler(
    playlistsService,
    songsService,
    {
      validatePlaylistPayload,
      validatePlaylistSongPayload,
    }
  );
  const uploadsHandler = new UploadsHandler(albumsService, storageService);

  const exportsHandler = new ExportsHandler(
    ProducerService,
    playlistsService,
    { validateExportPayload }
  );

  // Register route
  server.route(albumRoutes(albumsHandler));
  server.route(songRoutes(songsHandler));
  server.route(userRoutes(usersHandler));
  server.route(authenticationRoutes(authenticationsHandler));
  server.route(playlistRoutes(playlistsHandler));
  server.route(uploadsRoutes(uploadsHandler));
  server.route(exportsRoutes(exportsHandler));

  // Global Error Handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    if (response.isBoom && !response.isServer) {
      return h.response({
        status: 'fail',
        message: response.output.payload.message,
      }).code(response.output.statusCode);
    }

    if (response instanceof Error) {
      console.error(response);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server kami.',
      }).code(500);
    }

    return h.continue;
  });

  return server;
};

module.exports = init;
