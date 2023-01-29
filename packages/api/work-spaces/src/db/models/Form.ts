/* eslint-disable import/no-cycle */
import { DataTypes, Model, Optional } from 'sequelize';
import database from '../database';

export enum TypeFields {
  DATE = 'date',
  DROPDOWN = 'dropdown',
  EMAIL = 'email',
  TEXT = 'short_text',
  MULTIPLECHOICE = 'multiple_choice',
}

export interface FormAttributes {
  id?: number;
  formId: string;
  formName: string;
  questionId: string;
  questionLabel: string;
  type: string;
  answer: string;
}

export interface FormInput extends Optional<FormAttributes, 'id'> {}
export interface FormOuput extends Required<FormAttributes> {}

class Form extends Model<FormAttributes, FormInput> implements FormAttributes {
  declare id: number;

  declare formId: string;

  declare formName: string;

  declare questionId: string;

  declare questionLabel: string;

  declare type: string;

  declare answer: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Form.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    formId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'text',
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    sequelize: database,
    underscored: true,
    modelName: 'form',
  }
);

export default Form;
