/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import { Op, QueryTypes, Transaction } from 'sequelize';
import createHttpError from 'http-errors';
import Form, { FormAttributes } from '../db/models/Form';
import CompanyForm from '../db/models/CompanyForm';
import db from '../db';
import logger from '../helpers/logger';
import { NAME } from '../constants/forms';

const loggerInstance = logger('company-service');

const TYPEFORM_WEBHOOK_BASE_URL =
  process.env.NODE_ENV !== 'production' ? 'https://api-stage.wimet.co' : process.env.API_BASE_URL;

export default class FormService {
  static api: AxiosInstance = axios.create({
    baseURL: process.env.FORM_INSTANCE_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.FORM_INSTANCE_ACCESS_TOKEN}`,
    },
  });

  static async insertAnswers(answers: FormAttributes[], transaction?: Transaction) {
    return Form.bulkCreate(answers, { transaction });
  }

  static async getCollaboratorsForm() {
    const { data } = await this.api.get(`/forms/${process.env.TYPEFORM_COLLABORATORS_ID}`);
    return data;
  }

  static async createForm(form: any) {
    const { data } = await this.api.post('/forms', form);
    return data;
  }

  static async createHook(formId: number, tag: string) {
    const dataHook = {
      enabled: true,
      url: `${TYPEFORM_WEBHOOK_BASE_URL}/form`,
    };
    const { data } = await this.api.put(`/forms/${formId}/webhooks/${tag}`, dataHook);
    return data;
  }

  static async saveNewForm(payload) {
    return CompanyForm.create(payload);
  }

  static async findAllByCompanyId(companyId: number) {
    const forms = await CompanyForm.findAll({ where: { companyId }, order: [['created_at', 'DESC']], raw: true });

    return forms;
  }

  static async deleteFormById(companyId: number, formId: string) {
    const formToDelete = await CompanyForm.findOne({ where: { companyId, formId } });
    await formToDelete.destroy();
    await this.api.delete(`/forms/${formId}/webhooks/${formId}`);

    return formToDelete;
  }

  static async getSelectedAnswers(formId: string, questionLabel: string, orderBy: string = 'total DESC') {
    try {
      const answers = await db.query<{ answer: string; total: number }>(
        `
        SELECT f.answer, count(*) as total
        FROM forms as f
        WHERE f.form_id = '${formId}' AND f.question_label = '${questionLabel}'
        GROUP BY answer
        ORDER BY ${orderBy}
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      return answers;
    } catch (error) {
      loggerInstance.error('Error getting the answerd question fields', error);
      throw createHttpError(500, 'Error getting the company collaborators');
    }
  }

  static async getPercentageAnswerByCondition(
    formId: string,
    questionLabel: string,
    condition: string,
    colResultName: string = 'result'
  ) {
    try {
      const answers = await db.query<{ [key in string]: string }>(
        `
        SELECT round(sum(case when f.answer ${condition} then 1 else 0 end) * 100 / count(*)) as ${colResultName}
        FROM forms as f
        WHERE f.form_id = '${formId}' AND f.question_label = '${questionLabel}'
        `,
        {
          type: QueryTypes.SELECT,
        }
      );

      return answers[0];
    } catch (error) {
      loggerInstance.error('Error getting the answered question fields', error);
      throw createHttpError(500, 'Error getting the company collaborators');
    }
  }

  static async getAllOptionsForChart(responses, options) {
    const answeredOptions = responses.map(res => res.answer.toLocaleLowerCase());
    const formatedOptions = options.reduce((initial, option) => {
      if (!answeredOptions.includes(option.toLocaleLowerCase())) {
        return [...initial, { answer: option, total: 0 }];
      }

      return initial;
    }, responses);
    return formatedOptions;
  }

  static async getTotalResponses(formId) {
    const totalResponses = await Form.count({
      where: {
        [Op.and]: [
          {
            formId,
          },
          {
            questionLabel: NAME.q,
          },
        ],
      },
    });
    return totalResponses;
  }
}
