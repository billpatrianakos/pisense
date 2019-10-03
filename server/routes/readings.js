// Readings Controller
// ===================

'use strict';

const express        = require('express'),
      HomeController = express.Router(),
      keyCheck       = require('../lib/keycheck'),
      Reading        = require(__dirname + '/../models/reading'),
      moment         = require('moment');

ReadingsController.use(keyCheck); // Check API keys

// Readings API
ReadingsController.route('/?')
  // GET /readings/
  // --------------
  // Return latest reading
  .get((req, res, next) => {
    Reading
      .query((q) => {
        q.orderBy('id', 'DESC').limit(1)
      })
      .fetch()
      .then(reading => {
        res.json({ status: 'ok', temperature: reading.get('temperature'), humidity: reading.get('humidity'), created_at: moment(reading.get('created_at')).format('MMMM Do YYYY at h:mm.ss') });
      })
      .catch(err => {
        res.status(500).json({ status: 'error', message: 'Error in knex' });
      });
  })
