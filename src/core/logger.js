const pino = require('pino');
const { name } = require('../../package.json');

let logger;
let pinoLogger = {};

const loggerName = [
  process.env.LOGGER_PREFIX || name,
]
.filter(Boolean)
.join('_').replace(/-/g, '_').toUpperCase();

module.exports = () => {

  if (Object.keys(pinoLogger).length > 0) {
    return pinoLogger;
  }

  if (!logger) {
    logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      enabled: process.env.NODE_ENV !== 'test',
      name: 'aws-serverless-playground',
      safe: true,
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    });
    logger.addLevel('verbose', 25);
    logger.addLevel('silly', 5);
  }

  const pinoFunctions = Object.keys(logger).filter(key => typeof logger[key] === 'function');

  pinoFunctions.forEach((method) => {
    pinoLogger[method] = args => logger[method](`[${loggerName}]`, args);
  });

  return pinoLogger;
};
