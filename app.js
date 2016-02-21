var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var bcrypt = require('bcrypt-nodejs');
var njwt = require('njwt');
var fs = require('fs');
var db = require('./db.js');

var app = express();

//Non Synchronous call is on purpose. Config must be parse before we continue.
/*
var config = JSON.parse(fs.readFileSync('config.json','utf8'));
var secret = config.secret;
var signkey = config.signkey;
*/
var signkey = "PLACEHOLDER";
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Login post function goes here.
app.post('/',function(req,res,next){
  var email = req.body.email;
  var password = req.body.password;
  var query = "SELECT * FROM users WHERE email = $1";
  db.query({ text : query, values : [email]},function(err,results){
    if(err){
      console.error("error connecting to database");
      next(new Error('DB error'));
    } else{
      if(!(results.rows[0] && results.rows[0].email)){
        res.send({
          message: ("invalid email"),
          error: new Error("invalid email")
        });
        return;
      }
      bcrypt.compare(password,results.rows[0].password,function(err,success){
        if(err){
          console.error("bcrypt error");
          console.error(err);
          next(err);
        } else{
          if(success){
            var claims = {
              iss: "Molecular Playground URL",
              sub: results.rows[0].id,
              username: results.rows[0].username,
              email: email,
              admin: results.rows[0].admin
            };
            var jwt = njwt.create(claims,signkey);
            var token = jwt.compact();
            res.send({
              token: token
            });
          } else{
            res.send({
              message: ("invalid email or password"),
              error: new Error("invalid email or password")
            });
          }
        }
      });
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ message: err.message });
});


module.exports = app;
