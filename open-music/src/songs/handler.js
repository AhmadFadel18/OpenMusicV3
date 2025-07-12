const autoBind = require('../utils/autoBind');

class SongsHandler {
  constructor(service, { validateSongPayload }) {
    this._service = service;
    this._validateSongPayload = validateSongPayload;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      data: { songId },
    });
    response.code(201);
    return response;
  }


  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });

    return {
      status: 'success',
      data: {
        songs: songs.map(({ id, title, performer }) => ({ id, title, performer })),
      },
    };
  }


  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
