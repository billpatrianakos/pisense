// Home Controller
// ===============

'use strict';

const express        = require('express'),
      HomeController = express.Router(),
      authorize      = require('../lib/authorize'),
      fs             = require('fs'),
      Reading        = require(__dirname + '/../models/reading');

HomeController.use(authorize); // Require user to be logged in

HomeController.route('/?')
  // GET /
  // -----
  .get((req, res, next) => {
    new Reading
      .orderBy('id', 'desc')
      .limit(1)
      .fetch()
      .then((reading) => {
console.log('READING -------------------------------=========================');
console.log(reading);
        res.render('main', { temperature: reading.get('temperature'), humidity: reading.get('humidity'), created_at: reading.get('created_at') });
      })
      .catch((error) => {
console.log(error);
        res.status(500).send('Error in knex');
      });
  });

module.exports = HomeController;
