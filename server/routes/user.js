// Home Controller
// ===============

'use strict';

const express        	= require('express'),
      UsersController 	= express.Router();

UsersController.route('/?')
  // GET /
  // -----
  .get((req, res, next) => {
    res.render('auth', { messages: req.flash('info') });
  });

// UsersController.route('/login/?')
module.exports = UsersController;
