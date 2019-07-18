// Reading model
// =============

'use strict';

let Bookshelf = require('./index');

let Reading = Bookshelf.model.extend({
  tableName: 'readings',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Reading', Reading);
