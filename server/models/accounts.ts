import { Schema } from 'mongoose';
import { IAccount } from '../interfaces/account';
import { cnxAccounts } from '../db/mongodb';

const accountsSchema = new Schema<IAccount>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice para búsqueda por nombre
accountsSchema.index({ name: 'text' });

const Accounts = cnxAccounts.model<IAccount>('Accounts', accountsSchema);

export default Accounts;
