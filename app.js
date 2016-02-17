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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Login post function goes here.
app.post('/',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);
  var query = "SELECT password FROM users WHERE email = $1";
  db.query({ text : query, values : [username]},function(err,results){
    if(err){
      console.error("error connecting to database");
      next(new Error('DB error'));
    } else{
      if(results.rows[0].password === password){
        console.log("success");
        res.send("login success!");
      }
      else{
        res.send("login failure");
      }
      /*
        bcrypt.compare(password,results.rows[0].password,function(err,success){
        if(err){
          console.error("bcrypt error");
          next(new Error('bcrpyt error'));
        } else{
          if(success){
            var claims = {
              iss: "Molecular Playground URL",
              sub: "$(results.rows[0].id)",
              username: username,
              admin: "$(results.rows[0].admin)"
            };
            var jwt = njwt.create(claims,signkey);
            var token = jwt.compact;
            res.send({
              token: token
            });
          }
        }
      })
      */
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
