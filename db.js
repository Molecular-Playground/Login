// import the node postres wrapper
var pg = require('pg');
var POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
var conString = "postgres://postgres:" + POSTGRES_PASSWORD + "@postgres/postgres";

var query = function(queryStr, cb){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(queryStr, function(err, result) {
      done(); // release client back to pool

      if(err) {
        cb(err);
      } else {
        cb(undefined, result);
      }
    });
  });
};

module.exports = {
  query: query
};
