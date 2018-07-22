const fetch = require('node-fetch');
const logger = require('./core/logger')();

const start = async (event, context, callback) => {

  let message;
  let error = null;
  let response = {};

  try {
    logger.info('Starting Cron Poller. Received params: EVENT: ', event, 'CONTEXT: ', context);

    const url = `${process.env.API_URL}/healthcheck`;
    const headers = {
      'Content-Type': 'application/json',
    };

    response = await fetch(url, { method: 'GET', headers });
    logger.info(`Request for '${url}' returned HTTP Status '${response.status}'`);

    if (!response.ok || response.status !== 200) {
      throw new Error(`Cron Poller returned HTTP status '${response.status}'`);
    }

    message = `Event triggered with success at UTC TIME '${Math.floor(Date.now() / 1000)}'`;
    logger.info(message);
  } catch (err) {
    message = `Cron Poller returned HTTP status '${response.status || 'Not informed'}'`;
    error = message;
    logger.error(message, err);
  } finally {
    callback(error, { message });
  }
}

module.exports = { start };
