// Settings Controller
// ===================

'use strict';

const express        		= require('express'),
      SettingsController 	= express.Router(),
      authorize      		= require('../lib/authorize'),
      Setting           = require(__dirname + '/../models/setting');

SettingsController.use(authorize);

SettingsController.route('/?')
  // GET /
  // -----
  .get((req, res, next) => {
    // Get settings
    Setting
      .query((q) => {
        q.orderBy('id', 'DESC').limit(1);
      })
      .fetch()
      .then(settings => {
        res.render('settings', { settings: settings.toJSON() })
      });
  });

module.exports = SettingsController;
