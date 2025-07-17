import { IProduct } from '../../interfaces/product';
import Products from '../../models/products';
import Accounts from '../../models/accounts';
import { UserInputError } from 'apollo-server-express';
import logger from '../../utils/logger';

interface CreateProductInput {
  name: string;
  sku: string;
  stock: number;
  accountId: string;
}

interface PurchaseProductInput {
  accountId: string;
  productId: string;
  quantity: number;
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  product?: IProduct;
}

export const mutations = {
  createProduct: async (_: any, { input }: { input: CreateProductInput }): Promise<IProduct> => {
    try {
      logger.info('Iniciando creación de producto', {
        sku: input.sku,
        nombre: input.name,
      });

      // Verificar si la cuenta existe
      const accountExists = await Accounts.findById(input.accountId);
      if (!accountExists) {
        logger.warn('Cuenta no encontrada', {
          idCuenta: input.accountId,
        });
        throw new UserInputError('Validation Error', {
          message: 'La cuenta especificada no existe',
          invalidArgs: ['accountId'],
        });
      }

      // Verificar si ya existe un producto con el mismo SKU
      const existingProduct = await Products.findOne({ sku: input.sku });
      if (existingProduct) {
        logger.warn('SKU duplicado', {
          sku: input.sku,
        });
        throw new UserInputError('Validation Error', {
          message: `El SKU ${input.sku} ya está en uso`,
          invalidArgs: ['sku'],
        });
      }

      // Crear el nuevo producto
      const product = new Products(input);
      await product.save();

      logger.info('Producto creado exitosamente', {
        id: product._id,
        sku: product.sku,
      });

      return product;
    } catch (error: any) {
      logger.error('Error al crear producto', {
        error: error.message,
      });

      if (error instanceof UserInputError) {
        throw error;
      }
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  },

  purchaseProduct: async (
    _: any,
    { input }: { input: PurchaseProductInput }
  ): Promise<PurchaseResponse> => {
    try {
      logger.info('Iniciando proceso de compra', {
        idProducto: input.productId,
        cantidad: input.quantity,
      });

      // Verificar si la cuenta existe
      const accountExists = await Accounts.findById(input.accountId);
      if (!accountExists) {
        logger.warn('Cuenta no encontrada', {
          idCuenta: input.accountId,
        });
        throw new UserInputError('Validation Error', {
          message: 'La cuenta especificada no existe',
          invalidArgs: ['accountId'],
        });
      }

      // Verificar si el producto existe
      const product = await Products.findById(input.productId);
      if (!product) {
        logger.warn('Producto no encontrado', {
          idProducto: input.productId,
        });
        throw new UserInputError('Validation Error', {
          message: 'El producto especificado no existe',
          invalidArgs: ['productId'],
        });
      }

      // Validar cantidad
      if (input.quantity <= 0) {
        logger.warn('Cantidad inválida', {
          cantidad: input.quantity,
        });
        throw new UserInputError('Validation Error', {
          message: 'La cantidad debe ser mayor a 0',
          invalidArgs: ['quantity'],
        });
      }

      // Validar stock suficiente
      if (product.stock < input.quantity) {
        logger.warn('Stock insuficiente', {
          stockDisponible: product.stock,
          cantidadSolicitada: input.quantity,
        });
        throw new UserInputError('Validation Error', {
          message: `Stock insuficiente. Disponible: ${product.stock}`,
          invalidArgs: ['quantity'],
        });
      }

      // Actualizar el stock
      product.stock -= input.quantity;
      await product.save();

      logger.info('Compra realizada exitosamente', {
        idProducto: input.productId,
        cantidad: input.quantity,
        stockNuevo: product.stock,
      });

      return {
        success: true,
        message: 'Compra realizada con éxito',
        product,
      };
    } catch (error: any) {
      logger.error('Error al procesar la compra', {
        error: error.message,
      });

      if (error instanceof UserInputError) {
        throw error;
      }
      return {
        success: false,
        message: `Error al procesar la compra: ${error.message}`,
      };
    }
  },
};
