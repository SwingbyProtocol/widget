// eslint-disable-next-line import/no-internal-modules
const percyHealthCheck = require('@percy/cypress/task');

module.exports = (on, config) => {
  on('task', percyHealthCheck);
};
