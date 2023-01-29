import winston, { transport } from 'winston';
import { addColors } from 'winston/lib/winston/config';
import 'winston-daily-rotate-file';

const { combine } = winston.format;

const logger = (name: string) => {
  const transports: transport[] = [new winston.transports.Console()];

  addColors({
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    debug: 'green',
  });

  const colorizer = winston.format.colorize();

  if (process.env.NODE_ENV !== 'development')
    transports.push(
      new winston.transports.DailyRotateFile({
        filename: `logs/wimet-api-${process.env.NODE_ENV}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: false,
        maxSize: process.env.LOGGER_MAX_FILE_SIZE || '20m',
        maxFiles: process.env.LOGGER_MAX_FILES || '2',
      })
    );

  return winston.createLogger({
    silent: process.env.NODE_ENV === 'testing',
    levels: winston.config.npm.levels,
    format: combine(
      winston.format.label({
        label: `[${name}]`.toLocaleUpperCase(),
      }),
      winston.format.timestamp({
        format: 'YY-MM-DD HH:MM:SS',
      }),
      winston.format.simple(),
      winston.format.printf(msg =>
        colorizer.colorize(msg.level, `[${msg.timestamp}] - ${msg.label} - ${msg.level.toUpperCase()}: ${msg.message}`)
      )
    ),
    defaultMeta: { service: name },
    transports,
  });
};

export default logger;
