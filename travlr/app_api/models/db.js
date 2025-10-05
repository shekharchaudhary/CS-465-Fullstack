const mongoose = require('mongoose');
const readLine = require('readline');

const host = process.env.DB_API_HOST || process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

const connect = () => {
  setTimeout(() => mongoose.connect(dbURI, {}), 1000);
};

mongoose.connection.on('connected', () => {
  console.log(`API Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  console.log('API Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('API Mongoose disconnected');
});

if (process.platform === 'win32') {
  const rl = readLine.createInterface({ input: process.stdin, output: process.stdout });
  rl.on('SIGINT', () => { process.emit('SIGINT'); });
}

const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`API Mongoose disconnected through ${msg}`);
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination');
  process.exit(0);
});

process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown');
  process.exit(0);
});

// Connect and register models
connect();
require('./travlr');

module.exports = mongoose;

