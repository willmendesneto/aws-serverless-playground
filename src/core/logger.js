const pino = require('pino');

const { name } = require('../../package.json');

const levelsToAdd = {
  25: 'verbose',
  5: 'silly',
};

const defaultLevels = Object.assign(
  {},
  pino.levels.labels,
  levelsToAdd,
);

const pretty = pino.pretty({
  formatter: chunk => JSON.stringify(
    Object.assign(
      {},
      chunk,
      { level: defaultLevels[chunk.level] || chunk.level },
    ),
  ),
});

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
    pretty.pipe(process.stdout);
    logger = pino({
      name: loggerName,
      safe: true,
      timestamp: pino.stdTimeFunctions.slowTime,
      json: process.env.NODE_ENV !== 'development',
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    }, pretty);
    const levelToAddKeys = Object.keys(levelsToAdd);

    levelToAddKeys.forEach(key => {
      logger.addLevel(levelsToAdd[key], key);
    });
    logger.level = process.env.LOG_LEVEL || 'info';

    logger.info(`New levels added "${levelToAddKeys.join('","')}"`);
  }

  return logger;
};
