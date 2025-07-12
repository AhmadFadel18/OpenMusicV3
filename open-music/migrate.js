require('dotenv').config();
const path = require('path');
const { execFile } = require('child_process');

const migrateBinary = path.resolve(
  __dirname,
  'node_modules',
  'node-pg-migrate',
  'bin',
  'node-pg-migrate'
);

const env = {
  ...process.env,
  PGHOST: process.env.PGHOST,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,
  PGPORT: process.env.PGPORT,
};

execFile(migrateBinary, ['up'], { env }, (err, stdout, stderr) => {
  if (err) {
    console.error('Migration failed:', err.message);
    return;
  }
  if (stderr) {
    console.error(' stderr:', stderr);
  }
  console.log(' Migration success:\n' + stdout);
});
