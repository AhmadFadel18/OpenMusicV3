const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPayload(request.payload);

    const { id: playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    console.log(`[ExportsHandler] Request details:`);
    console.log(`[ExportsHandler]   - Path Playlist ID: ${playlistId}`);
    console.log(`[ExportsHandler]   - Target Email: ${targetEmail}`);
    console.log(`[ExportsHandler]   - Owner ID (from JWT token): ${ownerId}`);

    await this._playlistsService.verifyPlaylistAccess(playlistId, ownerId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getSongsFromPlaylist(playlistId);

    const dataToExport = {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
      targetEmail,
    };
    await this._producerService.sendMessage(
      'export:playlist',
      JSON.stringify(dataToExport)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
