import mongoose from 'mongoose';
import config from '../config/app';
import logger from '../utils/logger';

const {
  dbnorel: { accounts, products },
} = config;

const makeNewConnection = (name: string, uri: string): mongoose.Connection => {
  const db = mongoose.createConnection(uri);

  db.on('error', (error) => {
    logger.error('Error en la conexión de MongoDB', {
      baseDeDatos: name,
      error: error.message,
    });
    db.close().catch(() =>
      logger.error('Error al cerrar la conexión de MongoDB', {
        baseDeDatos: name,
      })
    );
  });

  db.on('connected', () => {
    logger.info('Conexión establecida con MongoDB', {
      baseDeDatos: name,
    });
  });

  db.on('disconnected', () => {
    logger.warn('Conexión de MongoDB desconectada', {
      baseDeDatos: name,
    });
  });

  return db;
};

const cnxAccounts = makeNewConnection('eiAccounts', accounts.uri);
const cnxProducts = makeNewConnection('eiProducts', products.uri);

export { cnxAccounts, cnxProducts };
