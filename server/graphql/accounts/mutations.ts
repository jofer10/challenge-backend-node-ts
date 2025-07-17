import { IAccount } from '../../interfaces/account';
import Accounts from '../../models/accounts';
import { GraphQLResolveInfo } from 'graphql';
import { UserInputError } from 'apollo-server-express';
import logger from '../../utils/logger';

interface Context {
  // Aquí puedes agregar propiedades del contexto si las necesitas
}

interface CreateAccountInput {
  name: string;
  email: string;
}

export const mutations = {
  createAccount: async (
    _parent: unknown,
    { input }: { input: CreateAccountInput },
    _context: Context,
    _info: GraphQLResolveInfo
  ): Promise<IAccount> => {
    try {
      logger.info('Iniciando creación de cuenta', {
        nombre: input.name,
        email: input.email,
      });

      // Verificar si ya existe una cuenta con el mismo email
      const existingAccount = await Accounts.findOne({ email: input.email });
      if (existingAccount) {
        logger.warn('Email duplicado', {
          email: input.email,
        });
        throw new UserInputError('Validation Error', {
          message: 'Ya existe una cuenta con este email',
          invalidArgs: ['email'],
        });
      }

      // Crear la nueva cuenta
      const account = new Accounts(input);
      await account.save();

      logger.info('Cuenta creada exitosamente', {
        id: account._id,
        email: account.email,
      });

      return account;
    } catch (error: any) {
      logger.error('Error al crear cuenta', {
        error: error.message,
      });

      if (error instanceof UserInputError) {
        throw error;
      }
      throw new Error(`Error al crear cuenta: ${error.message}`);
    }
  },
};
