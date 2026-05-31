import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as TSKV string', () => {
    const result = logger.formatMessage('warn', 'test message', 'context');

    expect(result).toBe(
      'level=warn\tmessage=test message\toptionalParams=["context"]',
    );
  });

  it('should escape special characters in TSKV values', () => {
    const result = logger.formatMessage('log', 'a=b\tc\nd\\e');

    expect(result).toBe(
      'level=log\tmessage=a\\=b\\tc\\nd\\\\e\toptionalParams=[]',
    );
  });

  it('should write warning message to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    logger.warn('test warning');

    expect(spy).toHaveBeenCalledWith(
      logger.formatMessage('warn', 'test warning'),
    );
  });
});
