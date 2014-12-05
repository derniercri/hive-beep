'use strict';

var config      = require('./libs/config'),
    mongoose    = require('mongoose'),
    CallerSchema  = require('./models/caller');

module.exports.Caller = mongoose.model('Caller', CallerSchema);
module.exports.connection = mongoose.connect(config.get('mongoose:uri'));
