// Settings Controller
// ===================

'use strict';

const express        		= require('express'),
      SettingsController 	= express.Router(),
      authorize      		= require('../lib/authorize'),
      fs             		= require('fs');

SettingsController.use(authorize);

SettingsController.route('/?')
  // GET /
  // -----
  .get((req, res, next) => {
    res.render('index');
  });

module.exports = SettingsController;
