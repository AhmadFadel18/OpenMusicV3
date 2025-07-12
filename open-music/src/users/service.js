const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this._pool.query({
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    });

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const result = await this._pool.query({
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    });

    if (result.rowCount > 0) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  async verifyUserCredential(username, password) {
    const result = await this._pool.query({
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    });

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw new AuthenticationError('Kredensial salah');
    }

    return id;
  }

  async getUserById(id) {
    const result = await this._pool.query({
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = UsersService;
