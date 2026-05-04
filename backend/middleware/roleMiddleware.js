const { sendError } = require('../utils/response');

const ownerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    return sendError(res, 'Access denied. Owners only.', 403);
  }
};

const tenantOnly = (req, res, next) => {
  if (req.user && req.user.role === 'tenant') {
    next();
  } else {
    return sendError(res, 'Access denied. Tenants only.', 403);
  }
};

module.exports = { ownerOnly, tenantOnly };