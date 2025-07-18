exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'TEXT',
      primaryKey: true,
    },
    user_id: {
      type: 'TEXT',
      notNull: true,
    },
    album_id: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('user_album_likes', 'unique_user_album_like', {
    unique: ['user_id', 'album_id'],
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
