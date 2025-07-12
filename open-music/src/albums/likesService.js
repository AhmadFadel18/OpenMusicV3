const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async likeAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };

    try {
      await this._pool.query(query);
      await this._cacheService.delete(`album_likes:${albumId}`);
    } catch (error) {
      throw new InvariantError('Gagal menyukai album');
    }
  }

  async unlikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async hasUserLikedAlbum(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async getAlbumLikes(albumId) {
    const cacheKey = `album_likes:${albumId}`;

    const cachedResult = await this._cacheService.get(cacheKey);
    if (cachedResult !== null) {
      const likes = JSON.parse(cachedResult);
      return { likes, fromCache: true };
    }

    const result = await this._pool.query({
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    });

    const likes = parseInt(result.rows[0].count, 10);

    await this._cacheService.set(cacheKey, JSON.stringify(likes));

    return { likes, fromCache: false };
  }

}

module.exports = AlbumLikesService;
