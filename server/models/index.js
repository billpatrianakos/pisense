// Database connection
// ===================

'use strict';

let knex      = require('knex')(require(__dirname + '/../../knexfile')[process.env.NODE_ENV || 'development']),
    bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');

module.exports = bookshelf;
