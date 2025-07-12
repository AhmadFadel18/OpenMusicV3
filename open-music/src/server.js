const init = require('./app');

init()
  .then((server) => server.start())
  .then(() => {
    console.log(`Server berjalan pada ${process.env.HOST}:${process.env.PORT}`);
  })
  .catch((err) => {
    console.error('Gagal menjalankan server:', err);
  });
