// Home Controller
// ===============

'use strict';

const express        = require('express'),
      HomeController = express.Router(),
      authorize      = require('../lib/authorize'),
      fs             = require('fs');

HomeController.use(authorize); // Require user to be logged in

HomeController.route('/?')
  // GET /
  // -----
  .get((req, res, next) => {
    res.render('main');
  });

module.exports = HomeController;
