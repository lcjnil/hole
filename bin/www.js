#!/usr/bin/env node
var debug = require('debug')('bupthole');
var app = require('../app');

if (process.env.SERVER_SOFTWARE == 'bae/3.0') {
  app.set('port', 18080);
}
else {
  app.set('port', 3000);
}

app.set('env', 'development');

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});