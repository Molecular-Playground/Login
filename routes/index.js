var express = require('express');
var router = express.Router();

/* POST login. */
router.post('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

module.exports = router;
