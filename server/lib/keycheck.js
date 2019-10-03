// keyCheck
// ========
// Check API key before allowing request to proceed

const _       = require('lodash'),
      config  = _.merge(require('../config/application').defaults, require('../config/application')[process.env.NODE_ENV || 'development']);

module.exports = (req, res, next) => {  
  if (req.body.api_key === config.api_key) {
    next();
  } else {
    next(err);
  }
};
