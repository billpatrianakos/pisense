// Settings Controller
// ===================

'use strict';

const express        		= require('express'),
      SettingsController 	= express.Router(),
      authorize      		= require('../lib/authorize'),
      Setting           = require(__dirname + '/../models/setting');

SettingsController.use(authorize);

SettingsController.route('/?')
  // GET /settings
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
  })
  // POST /settings/
  // ---------------
  // Update settings
  .post((req, res, next) => {
    // get the id
    // parse the am/pm stuff
    // maybe do some validation
    // save it
    // redirect to home or settings?
  });

module.exports = SettingsController;
