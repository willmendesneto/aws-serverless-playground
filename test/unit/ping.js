const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();
const sandbox = require('sinon').createSandbox();

const fetch = sandbox.stub();
const callback = sandbox.stub();
const { start } = proxyquire('../../src/ping', {
  'node-fetch': fetch
});
const API_URL = 'http://url.com.au';

describe('ping.js', () => {
  beforeEach(() => {
    sandbox.stub(process, 'env').value({ API_URL });
  });

  after(() => sandbox.restore());

  afterEach(() => sandbox.reset());

  it('should do a http call for the `healthcheck` endpoint in the given url', async () => {
    fetch.returns({ ok: true, status: 200 });
    await start({}, {}, callback);
    const [error] = fetch.firstCall.args;
    assert.equal(error, `${API_URL}/healthcheck`);
  });

  it('should return a success message if HTTP Status is 200', async () => {
    fetch.returns({ ok: true, status: 200 });
    await start({}, {}, callback);
    const [error, data] = callback.firstCall.args;
    assert.equal(error, null);
    assert.equal(data.message, `Event triggered with success at UTC TIME '${Math.floor(Date.now() / 1000)}'`);
  });

  it('should return an error if HTTP Status returns an error', async () => {
    fetch.returns({ ok: false, status: 404 });
    await start({}, {}, callback);
    const [error] = callback.firstCall.args;
    assert.equal(error, 'Cron Poller returned HTTP status \'404\'');
  });

  it('should return an error if HTTP Status is not 200', async () => {
    fetch.returns({ ok: true, status: 404 });
    await start({}, {}, callback);
    const [error] = callback.firstCall.args;
    assert.equal(error, 'Cron Poller returned HTTP status \'404\'');
  });
});
