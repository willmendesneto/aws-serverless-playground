const proxyquire = require('proxyquire');
const assert = require('assert');
const sandbox = require('sinon').createSandbox();

const pinoMock = sandbox.stub();
const addLevel = sandbox.stub();
const info = sandbox.stub();

const loggerProvider = proxyquire('../../../src/core/logger', {
  pino: pinoMock,
});

describe('Core: logger', () => {
  let logger;

  beforeEach(() => {
    pinoMock.returns({ addLevel, info });
    logger = loggerProvider();
  });

  after(() => sandbox.restore());

  it('should notify the new added levels', () => {
    const [newLevelsLog] = info.args;
    assert.deepEqual(newLevelsLog, ['New levels added "5","25"']);
  });

  it('should add `verbose` and `silly` functions with respective level values', () => {
    const [sillyConfig, verboseConfig] = addLevel.args;
    assert.deepEqual(verboseConfig, ['verbose', 25]);
    assert.deepEqual(sillyConfig, ['silly', 5]);
  });

  it('should NOT create multiple instances of the same logger if called multiple times', () => {
    const secondLogger = loggerProvider();

    assert.equal(pinoMock.callCount, 1);
    assert.equal(secondLogger, logger);
  });
});
