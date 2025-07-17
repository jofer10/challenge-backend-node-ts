import { IProduct } from '../../interfaces/product';
import Products from '../../models/products';
import Accounts from '../../models/accounts';
import { UserInputError } from 'apollo-server-express';

export const queries = {
  product: async (_: any, { id }: { id: string }): Promise<IProduct | null> => {
    try {
      const product = await Products.findById(id);
      if (!product) {
        throw new UserInputError('Product not found');
      }
      return product;
    } catch (error: any) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new Error(`Error fetching product: ${error.message}`);
    }
  },

  productsByAccount: async (_: any, { accountId }: { accountId: string }): Promise<IProduct[]> => {
    try {
      // Verificar si la cuenta existe
      const accountExists = await Accounts.findById(accountId);
      if (!accountExists) {
        throw new UserInputError('Account not found');
      }

      // Obtener todos los productos de la cuenta
      const products = await Products.find({ accountId }).sort({ createdAt: -1 });

      return products;
    } catch (error: any) {
      if (error instanceof UserInputError) {
        throw error;
      }
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },
};
