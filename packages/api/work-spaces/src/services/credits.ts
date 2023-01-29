import { Transaction } from 'sequelize';
import Credits, { CreditOuput } from '../db/models/Credits';
import Currency from '../db/models/Currency';

type CreditsFilters = Partial<CreditOuput>;

export default class CreditsService {
  static async getAll(filters?: CreditsFilters) {
    return Credits.findAll({
      where: filters,
      include: [Currency],
    });
  }

  static async getByCurrency(currencyId: number) {
    return Credits.findOne({ where: { currencyId }, rejectOnEmpty: true });
  }

  static async getByCompany(companyId: number, transaction?: Transaction) {
    return Credits.scope({ method: ['byCompany', companyId] }).findOne({ rejectOnEmpty: true, transaction });
  }
}
