// Home Controller
// ===============

'use strict';

const express        = require('express'),
      HomeController = express.Router(),
      authorize      = require('../lib/authorize'),
      Reading        = require(__dirname + '/../models/reading'),
      moment         = require('moment');

HomeController.use(authorize); // Require user to be logged in

HomeController.route('/?')
  // GET /
  // -----
  .get((req, res, next) => {
    Reading
      .query((q) => {
        q.orderBy('id', 'DESC').limit(1)
      })
      .fetch()
      .then(reading => {
        res.render('main', { temperature: reading.get('temperature'), humidity: reading.get('humidity'), created_at: moment(reading.get('created_at')).format('MMMM Do YYYY at h:mm.ss') });
      })
      .catch(err => {
        res.status(500).send('Error in knex');
      });
  });

module.exports = HomeController;
