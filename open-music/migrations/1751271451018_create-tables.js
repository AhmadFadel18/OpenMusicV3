exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    username: { type: 'VARCHAR(50)', notNull: true, unique: true },
    password: { type: 'TEXT', notNull: true },
    fullname: { type: 'TEXT', notNull: true },
  });

  pgm.createTable('albums', {
    id: { type: 'varchar(50)', primaryKey: true },
    name: { type: 'text', notNull: true },
    year: { type: 'integer', notNull: true },
  });


  pgm.createTable('songs', {
    id: { type: 'varchar(50)', primaryKey: true },
    title: { type: 'varchar(100)', notNull: true },
    year: { type: 'integer', notNull: true },
    genre: { type: 'varchar(50)', notNull: true },
    performer: { type: 'varchar(100)', notNull: true },
    duration: { type: 'integer' },
    album_id: {
      type: 'varchar(50)',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('songs');
  pgm.dropTable('albums');
  pgm.dropTable('users');
};