// Reading model
// =============

'use strict';

let Bookshelf = require('./index');

let Reading = Bookshelf.Model.extend({
  tableName: 'readings',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Reading', Reading);
