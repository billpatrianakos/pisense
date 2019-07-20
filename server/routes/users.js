// Home Controller
// ===============

'use strict';

const express         = require('express'),
      UsersController = express.Router(),
      User            = require(__dirname + '/../models/user'),
      bcrypt          = require('bcrypt');

UsersController.route('/?')
  // GET /
  // -----
  // Render login page
  .get((req, res, next) => {
    res.render('auth', { messages: req.flash('info') });
  })
  // POST /
  // ------
  // Log user in
  .post((req, res, next) => {
console.log('1 -------------------------------');
    const { username, password } = req.body;
    new User({ username: username })
      .fetch({ require: true })
      .then((user) => {
console.log('2 -------------------------------');
        bcrypt.compare(password, user.get('password'))
          .then((response) => {
            if (response) {
console.log('3 -------------------------------');
              req.session.userId = user.get('id');
              req.session.loggedIn = true;
              res.redirect('/');
            } else {
console.log('4 -------------------------------');
              res.status(401).render('auth', { messages: ['Username or password was incorrect'] });
            }
          });
      })
      .catch((err) => {
        // User not found
        res.status(401).render('auth', { messages: ['Username or password was incorrect'] });
      });
  });

// UsersController.route('/login/?')
module.exports = UsersController;
