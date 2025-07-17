import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Asegurar que la carpeta de logs existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...data }) => {
      const nivelLog =
        {
          error: 'ERROR',
          warn: 'ADVERTENCIA',
          info: 'INFO',
        }[level] || level.toUpperCase();

      return `[${timestamp}] ${nivelLog}: ${message} ${Object.keys(data).length ? JSON.stringify(data) : ''}`;
    })
  ),
  transports: [
    // Escribir logs de error en error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    // Escribir todos los logs en combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

// Si no estamos en producción, también log a la consola con colores
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...data }) => {
          const nivelLog =
            {
              error: 'ERROR',
              warn: 'ADVERTENCIA',
              info: 'INFO',
            }[level] || level.toUpperCase();

          return `[${timestamp}] ${nivelLog}: ${message} ${Object.keys(data).length ? JSON.stringify(data) : ''}`;
        })
      ),
    })
  );
}

export default logger;
