// Settings model
// ==============

'use strict';

let Bookshelf = require('./index');

let Setting = Bookshelf.model.extend({
  tableName: 'settings',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Setting', Setting);
