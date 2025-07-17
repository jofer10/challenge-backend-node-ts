import { Schema } from 'mongoose';
import { IProduct } from '../interfaces/product';
import { cnxProducts } from '../db/mongodb';

const productsSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
    },
    accountId: {
      type: String,
      required: [true, 'Account ID is required'],
      ref: 'Accounts',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice para búsquedas eficientes por accountId
productsSchema.index({ accountId: 1 });

const Products = cnxProducts.model<IProduct>('Products', productsSchema);

export default Products;
