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
var SIGNING_KEY = process.env.SIGNING_KEY;
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
        var err = new Error("Invalid email or password");
        err.status = 403;
        next(err);
        return;
      }
      bcrypt.compare(password,results.rows[0].password,function(err,success){
        if(err){
          console.error("bcrypt error");
          console.error(err);
          next(err);
        } else{
          if(success){
            if(!results.rows[0].validated){
              var err = new Error("User is not validated");
              err.status = 401;
              next(err);
              return;
            } else{
              var query = "SELECT * FROM admin WHERE uid = $1";
              db.query({text:query, values: [results.rows[0].uid]}, function(err,admin){
                var claims = {
                  iss: "Molecular Playground URL",
                  sub: results.rows[0].uid,
                  username: results.rows[0].username,
                  email: email,
                  admin: admin.rows.length > 0
                };
                var jwt = njwt.create(claims,SIGNING_KEY);
                var token = jwt.compact();
                res.send({
                  token: token,
                  username: results.rows[0].username,
                  admin: admin.rows.length > 0
                });
              });
            }
          } else{
            var err = new Error("Invalid email or password");
            err.status = 403;
            next(err);
            return;
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
