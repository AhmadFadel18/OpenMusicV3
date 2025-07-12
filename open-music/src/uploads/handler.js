const autoBind = require('auto-bind');
const ClientError = require('../exceptions/ClientError');

class UploadsHandler {
  constructor(albumsService, storageService) {
    this._albumsService = albumsService;
    this._storageService = storageService;

    autoBind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    if (!cover || !cover.hapi || !cover._data) {
      throw new ClientError('Berkas tidak valid', 400);
    }

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.addAlbumCover(albumId, fileUrl);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = UploadsHandler;