const autoBind = require('../utils/autoBind');
const ClientError = require('../exceptions/ClientError');


class AlbumsHandler {
  constructor(service, storageService, albumLikesService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._albumLikesService = albumLikesService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: { albumId },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async uploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    const filename = await this._storageService.writeFile(cover.hapi.filename, cover._data);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/file/${filename}`;

    await this._service.updateAlbumCover(id, fileLocation);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getAlbumById(albumId);

    const isLiked = await this._albumLikesService.hasUserLikedAlbum(albumId, userId);

    if (isLiked) {
      throw new ClientError('Anda sudah menyukai album ini', 400);
    }


    await this._albumLikesService.likeAlbum(albumId, userId);
    return h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    }).code(201);
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, fromCache } = await this._albumLikesService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: { likes },
    });

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;
