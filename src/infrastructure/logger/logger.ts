import pino from 'pino';
import config from '../../../config/env';

const transport = config.nodeEnv === 'development' ? { target: 'pino/file', options: { destination: 1 } } : undefined;

const logger = pino({
  level: config.logLevel,
  transport,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      requestId: req.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
});

export default logger;
