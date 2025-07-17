import { IAccount } from '../../interfaces/account';
import Accounts from '../../models/accounts';
import config from '../../config/app';
import { UserInputError } from 'apollo-server-express';
import logger from '../../utils/logger';

export const queries = {
  account: async (_: any, { id }: { id: string }): Promise<IAccount | null> => {
    try {
      logger.info('Buscando cuenta por ID', { id });

      const account = await Accounts.findById(id);
      if (!account) {
        logger.warn('Cuenta no encontrada', { id });
        throw new UserInputError('Cuenta no encontrada');
      }

      return account;
    } catch (error: any) {
      logger.error('Error al buscar cuenta', {
        error: error.message,
      });

      if (error instanceof UserInputError) {
        throw error;
      }
      throw new Error(`Error al buscar cuenta: ${error.message}`);
    }
  },

  accounts: async (
    _: any,
    {
      page = config.pagination.page,
      perPage = config.pagination.perPage,
      name,
    }: {
      page?: number;
      perPage?: number;
      name?: string;
    }
  ): Promise<{ accounts: IAccount[]; totalCount: number }> => {
    try {
      logger.info('Listando cuentas', {
        pagina: page,
        porPagina: perPage,
        filtroNombre: name || 'ninguno',
      });

      const query = name ? { $text: { $search: name } } : {};
      const skip = (page - 1) * perPage;

      const [accounts, totalCount] = await Promise.all([
        Accounts.find(query).skip(skip).limit(perPage).sort({ createdAt: -1 }),
        Accounts.countDocuments(query),
      ]);

      logger.info('Cuentas recuperadas exitosamente', {
        totalEncontradas: totalCount,
        mostrandoRegistros: accounts.length,
      });

      return {
        accounts,
        totalCount,
      };
    } catch (error: any) {
      logger.error('Error al listar cuentas', {
        error: error.message,
      });
      throw new Error(`Error al listar cuentas: ${error.message}`);
    }
  },
};
