// import the node postres wrapper
var pg = require('pg');

/************************************************
 * An example connection string.

 * CHANGE THIS OR IT WON'T WORK ON YOUR MACHINE.

 ************************************************/
var conString = "postgres://aaron:1234@localhost/playground";

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
