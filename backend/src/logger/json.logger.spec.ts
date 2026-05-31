import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as JSON string', () => {
    const result = logger.formatMessage('log', 'test message', 'context');

    expect(JSON.parse(result)).toEqual({
      level: 'log',
      message: 'test message',
      optionalParams: ['context'],
    });
  });

  it('should write log message to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.log('test message', 'context');

    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('log', 'test message', 'context'),
    );
  });

  it('should write error message to console.error', () => {
    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('test error');

    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('error', 'test error'),
    );
  });
});
