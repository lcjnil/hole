var mongoose = require('mongoose');
var settings = require('../settings.js');

if (process.env.SERVER_SOFTWARE == 'bae/3.0') {
  host = settings.db_host;
  port = settings.db_port;
  database = settings.db_name;
  options = {
    server: {poolSize: 5},
    user: settings.username,
    pass: settings.password,
  };
} else {
  host = 'localhost';
  database = 'test';
  port = 27017;
  options = {
    server: {poolSize: 5},
  };
}

//mongoose.connect('mongodb://localhost/glance');

var db = mongoose.connection;
db.open(host, database, port, options);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to the mongodb');
});
db.on('disconnected', function() {
  db.open(host, database, port, options);
});

module.exports = mongoose;