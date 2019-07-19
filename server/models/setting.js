// Settings model
// ==============

'use strict';

let Bookshelf = require('./index');

let Setting = Bookshelf.Model.extend({
  tableName: 'settings',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Setting', Setting);
