// Simple logging utility

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLevel = process.env.LOG_LEVEL || 'INFO';

const log = (level, message, ...args) => {
  if (logLevels[level] <= logLevels[currentLevel]) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    switch (level) {
      case 'ERROR':
        console.error(logMessage, ...args);
        break;
      case 'WARN':
        console.warn(logMessage, ...args);
        break;
      case 'INFO':
        console.info(logMessage, ...args);
        break;
      case 'DEBUG':
        console.debug(logMessage, ...args);
        break;
      default:
        console.log(logMessage, ...args);
    }
  }
};

export const logger = {
  error: (message, ...args) => log('ERROR', message, ...args),
  warn: (message, ...args) => log('WARN', message, ...args),
  info: (message, ...args) => log('INFO', message, ...args),
  debug: (message, ...args) => log('DEBUG', message, ...args)
};
