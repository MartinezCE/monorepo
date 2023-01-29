import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';
import Company from './Company';

export enum WimetBillsStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
}

export enum WimetBillsMethod {
  MERCADOPAGO = 'MERCADOPAGO',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

interface WimetBillsAttributes {
  id?: number;
  companyId: number;
  startDate: string;
  endDate: string;
  status?: WimetBillsStatus;
  paymentId?: string;
  paymentMethod?: WimetBillsMethod;
  paymentDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WimetBillsInput
  extends Optional<WimetBillsAttributes, 'id' | 'status' | 'paymentId' | 'paymentMethod' | 'paymentDate'> {}
export interface WimetBillsOuput extends Required<WimetBillsAttributes> {}

class WimetBills extends Model<WimetBillsAttributes, WimetBillsInput> implements WimetBillsAttributes {
  declare id: number;

  declare companyId: number;

  declare startDate: string;

  declare endDate: string;

  declare status?: WimetBillsStatus;

  declare paymentId?: string;

  declare paymentMethod?: WimetBillsMethod;

  declare paymentDate?: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

WimetBills.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(WimetBillsStatus)),
      allowNull: false,
      defaultValue: WimetBillsStatus.PENDING,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.keys(WimetBillsMethod)),
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'WimetBills',
  }
);

export default WimetBills;
