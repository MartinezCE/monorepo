/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from 'express';
import logger from '../helpers/logger';
import FormService from '../services/form';
import { FormAttributes, TypeFields } from '../db/models/Form';
import CompanyService from '../services/company';
import {
  COMPANY_SHOULD_HAVE_AN_OFFICE,
  DAYS_PER_WEEK_WOULD_LIKE_TO_WORK_FROM_OFFICE,
  HOW_MANY_DAYS_WORK_FROM_ANYWHERE,
  IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME,
  ITEMS_WOULD_LIKE_TO_HAVE_IN_OFFICE,
  LIKE_ABOUT_WORKING_FROM_OFFICE,
  LIKE_ABOUT_WORKING_HOME,
  MIND_IF_OFFICE_IS_SHARED,
  NOT_LIKE_ABOUT_WORKING_FROM_OFFICE,
  NOT_LIKE_ABOUT_WORKING_HOME,
  WHAT_WOULD_YOU_LIKE_AN_OFFICE_FOR,
  WHERE_WOULD_YOU_LIKE_COWORK_SPACE_TO_BE_LOCATED,
  WHY_CHOSE_WORK_FROM_OTHER_PLACE,
  WORK_FROM_ANYWHERE_IF_COMPANY_PAYS,
  WORK_FROM_HOME_WHITHOUT_MAKING_CHANGES,
  WOULD_LIKE_COMPANY_HAS_PART_TIME_OFFICE,
  WOULD_NOT_LIKE_HOT_DESK_MODE,
} from '../constants/forms';
import CompanyForm from '../db/models/CompanyForm';

const loggerInstance = logger('form-controller');

/* --> FORM HELPERS START */

const formatAnswer = (
  id: string,
  title: string,
  questionId: string,
  questionLabel: string,
  type: TypeFields,
  answer: string
) => {
  return {
    formId: id,
    formName: title,
    questionId,
    questionLabel,
    type,
    answer,
  };
};

const cleanIdProp = obj => {
  const { id: idToRemove, ...rest } = obj;
  return rest;
};

const responsesPercentage = (res: { total: number; answer: string }[], totalRes: number) =>
  res.map(r => ({
    answer: r.answer,
    total: Math.trunc((r.total / totalRes) * 100),
  }));

/* FORM HELPERS END <-- */

export default class FormController {
  static async insetAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const { form_response } = req.body;
      const { definition, answers } = form_response;
      const { id, title, fields } = definition;

      const newAnswers: FormAttributes[] = [];

      fields.forEach((val, idx) => {
        if (val.type !== TypeFields.MULTIPLECHOICE && val.type !== TypeFields.DROPDOWN) {
          newAnswers.push(formatAnswer(id, title, val.id, val.title, val.type, answers[idx][answers[idx].type]));
        } else if (val.allow_multiple_selections) {
          answers[idx].choices.labels.forEach(choice => {
            newAnswers.push(formatAnswer(id, title, val.id, val.title, val.type, choice));
          });
        } else {
          newAnswers.push(formatAnswer(id, title, val.id, val.title, val.type, answers[idx].choice.label));
        }
      });
      const response = await FormService.insertAnswers(newAnswers);
      return res.send(response);
    } catch (error) {
      loggerInstance.error('There was an error adding answers', error);
      return next(error);
    }
  }

  static async duplicateCollaboratorsForm(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await CompanyService.findCompanyByUserId(req.user.id);

      const ORIGINAL_FORM = await FormService.getCollaboratorsForm();
      const CLONED_FORM = JSON.parse(JSON.stringify(ORIGINAL_FORM));

      const { created_at, last_updated_at, published_at, _links, id, workspace, ...formToCreate } = CLONED_FORM;
      formToCreate.thankyou_screens = [cleanIdProp(formToCreate.thankyou_screens[0])];
      formToCreate.welcome_screens = [cleanIdProp(formToCreate.welcome_screens[0])];
      formToCreate.workspace = {
        href: `${process.env.FORM_INSTANCE_BASE_URL}/workspaces/${process.env.TYPEFORM_WORKSPACE_ID}`,
      };
      formToCreate.title = `${formToCreate.title} - ${company.name}`;

      formToCreate.fields = formToCreate.fields.map(field => {
        const cleanedField = cleanIdProp(field);

        if ('choices' in cleanedField?.properties) {
          cleanedField.properties.choices = cleanedField.properties.choices.map(choice => cleanIdProp(choice));

          return cleanedField;
        }

        return cleanedField;
      });

      const createdForm = await FormService.createForm(formToCreate);
      const success = await FormService.saveNewForm({
        formId: createdForm.id,
        companyId: company.id,
        formLink: `https://form.typeform.com/to/${createdForm.id}`,
        formName: createdForm.title,
      });

      await FormService.createHook(createdForm.id, createdForm.id);

      return res.send(success);
    } catch (error) {
      loggerInstance.error('There was an error duplicating collaborators form', error);
      return next(error);
    }
  }

  static async getCompanyForms(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      const forms = await FormService.findAllByCompanyId(company.id);

      const allForms = await Promise.all(
        forms.map(async form => {
          const responsesSoFar = await FormService.getTotalResponses(form.formId);
          return { ...form, totalResponses: responsesSoFar };
        })
      );

      return res.send(allForms);
    } catch (error) {
      loggerInstance.error('There was an error getting the company forms', error);
      return next(error);
    }
  }

  static async deleteCompanyForm(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      const deletedForm = await FormService.deleteFormById(company.id, req.params.formId);

      return res.send(deletedForm);
    } catch (error) {
      loggerInstance.error('There was an error deleting the company form', error);
      return next(error);
    }
  }

  static async getSummarySection(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const [workingFromHome] = await FormService.getSelectedAnswers(req.params.formId, LIKE_ABOUT_WORKING_HOME.q);

      const [coworkLocation] = await FormService.getSelectedAnswers(
        req.params.formId,
        WHERE_WOULD_YOU_LIKE_COWORK_SPACE_TO_BE_LOCATED.q
      );

      const [itemsInOffice] = await FormService.getSelectedAnswers(
        req.params.formId,
        ITEMS_WOULD_LIKE_TO_HAVE_IN_OFFICE.q
      );

      const [whyLikeOffice] = await FormService.getSelectedAnswers(
        req.params.formId,
        WHAT_WOULD_YOU_LIKE_AN_OFFICE_FOR.q
      );

      const { companyShouldHaveOffice } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        COMPANY_SHOULD_HAVE_AN_OFFICE.q,
        "= 'Si'",
        'companyShouldHaveOffice'
      );

      const { daysPerWeekWorkFromHome } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME.q,
        '>= 1',
        'daysPerWeekWorkFromHome'
      );

      const { companyHasPartimeOffice } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        WOULD_LIKE_COMPANY_HAS_PART_TIME_OFFICE.q,
        "= 'Si'",
        'companyHasPartimeOffice'
      );

      const { workFromAnywhereIfCompanyPays } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        WORK_FROM_ANYWHERE_IF_COMPANY_PAYS.q,
        "= 'Si'",
        'workFromAnywhereIfCompanyPays'
      );

      return res.send({
        percentage: {
          companyShouldHaveOffice,
          daysPerWeekWorkFromHome,
          companyHasPartimeOffice,
          workFromAnywhereIfCompanyPays,
        },
        info: { workingFromHome, coworkLocation, itemsInOffice, whyLikeOffice },
      });
    } catch (error) {
      loggerInstance.error('There was an error getting the form summary section', error);
      return next(error);
    }
  }

  static async getChoiceOfWorkplaceSummary(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      // summary percentage
      const { percentageWorkFromOffice } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        DAYS_PER_WEEK_WOULD_LIKE_TO_WORK_FROM_OFFICE.q,
        '>= 1',
        'percentageWorkFromOffice'
      );

      const { percentageWorkFromHome } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME.q,
        '>= 1',
        'percentageWorkFromHome'
      );

      const { percentageWorkFromAnywhere } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        HOW_MANY_DAYS_WORK_FROM_ANYWHERE.q,
        '>= 1',
        'percentageWorkFromAnywhere'
      );

      // data res
      const workFromOfficeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        DAYS_PER_WEEK_WOULD_LIKE_TO_WORK_FROM_OFFICE.q,
        'answer ASC'
      );
      const workFromOffice = await FormService.getAllOptionsForChart(
        workFromOfficeRes,
        DAYS_PER_WEEK_WOULD_LIKE_TO_WORK_FROM_OFFICE.options
      );

      const workFromHomeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME.q,
        'answer ASC'
      );
      const workFromHome = await FormService.getAllOptionsForChart(
        workFromHomeRes,
        IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME.options
      );

      const workFromAnywhereRes = await FormService.getSelectedAnswers(
        req.params.formId,
        HOW_MANY_DAYS_WORK_FROM_ANYWHERE.q,
        'answer ASC'
      );
      const workFromAnywhere = await FormService.getAllOptionsForChart(
        workFromAnywhereRes,
        HOW_MANY_DAYS_WORK_FROM_ANYWHERE.options
      );

      return res.send({
        topSummary: [
          { info: 'le gustaría trabajar desde casa al menos una vez', percentage: percentageWorkFromOffice },
          {
            info: 'le gustaría trabajar desde la oficina de la empresa al menos una vez',
            percentage: percentageWorkFromHome,
          },
          { info: 'le gustaría trabajar desde otro lugar al menos una vez', percentage: percentageWorkFromAnywhere },
        ],
        data: [
          {
            question: DAYS_PER_WEEK_WOULD_LIKE_TO_WORK_FROM_OFFICE.q,
            answers: workFromOffice,
            type: 'CHART',
            xLabel: 'Días desde la oficina >',
          },
          {
            question: IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME.q,
            answers: workFromHome,
            type: 'CHART',
            xLabel: 'Días desde casa >',
          },
          {
            question: HOW_MANY_DAYS_WORK_FROM_ANYWHERE.q,
            answers: workFromAnywhere,
            type: 'CHART',
            xLabel: 'Días desde terceros espacios >',
          },
        ],
      });
    } catch (error) {
      loggerInstance.error('There was an error getting the choice of workplace summary section', error);
      return next(error);
    }
  }

  static async getEmployeesPreferencesSummary(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const totalResponses = await FormService.getTotalResponses(req.params.formId);

      // summary percentage
      const { percentageCompanyShouldHaveOffice } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        COMPANY_SHOULD_HAVE_AN_OFFICE.q,
        "= 'Si'",
        'percentageCompanyShouldHaveOffice'
      );

      // data res
      const whyLikeOfficeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        WHAT_WOULD_YOU_LIKE_AN_OFFICE_FOR.q
      );
      const whyLikeOfficePercentages = responsesPercentage(whyLikeOfficeRes, totalResponses);
      const whyLikeOffice = await FormService.getAllOptionsForChart(
        whyLikeOfficePercentages,
        WHAT_WOULD_YOU_LIKE_AN_OFFICE_FOR.options
      );

      const summaryDetailWhyOffice =
        whyLikeOfficeRes.length > 1
          ? `son ${whyLikeOfficeRes[0].answer} y ${whyLikeOfficeRes[1].answer}`
          : `es ${whyLikeOfficeRes[0].answer}`;

      const whatLikeWorkFromOfficeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        LIKE_ABOUT_WORKING_FROM_OFFICE.q
      );
      const whatLikeOfficePercentages = responsesPercentage(whatLikeWorkFromOfficeRes, totalResponses);
      const whatLikeWorkFromOffice = await FormService.getAllOptionsForChart(
        whatLikeOfficePercentages,
        LIKE_ABOUT_WORKING_FROM_OFFICE.options
      );

      const itemsInOfficeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        ITEMS_WOULD_LIKE_TO_HAVE_IN_OFFICE.q
      );
      const itemsInOfficePercentages = responsesPercentage(itemsInOfficeRes, totalResponses);
      const itemsInOffice = await FormService.getAllOptionsForChart(
        itemsInOfficePercentages,
        ITEMS_WOULD_LIKE_TO_HAVE_IN_OFFICE.options
      );

      const notLikeWorkFromOfficeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        NOT_LIKE_ABOUT_WORKING_FROM_OFFICE.q
      );
      const notLikeWorkFromOfficePercentages = responsesPercentage(notLikeWorkFromOfficeRes, totalResponses);
      const notLikeWorkFromOffice = await FormService.getAllOptionsForChart(
        notLikeWorkFromOfficePercentages,
        NOT_LIKE_ABOUT_WORKING_FROM_OFFICE.options
      );

      const { wouldLikeOfficeIsShared } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        MIND_IF_OFFICE_IS_SHARED.q,
        "= 'Si'",
        'wouldLikeOfficeIsShared'
      );

      const { wouldNotLikeHotDeskMode } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        WOULD_NOT_LIKE_HOT_DESK_MODE.q,
        "= 'Si'",
        'wouldNotLikeHotDeskMode'
      );

      return res.send({
        topSummary: [
          {
            info: `de su equipo todavía quiere que su empresa tenga algún tipo de oficina. Las razones principales de esto ${summaryDetailWhyOffice.toLocaleLowerCase()}`,
            percentage: percentageCompanyShouldHaveOffice,
          },
        ],
        data: [
          {
            question: COMPANY_SHOULD_HAVE_AN_OFFICE.q,
            answers: [
              {
                yes: Number(percentageCompanyShouldHaveOffice),
                no: 100 - Number(percentageCompanyShouldHaveOffice),
              },
            ],
            type: 'MULTIPLE-PROGRESS',
          },
          { question: WHAT_WOULD_YOU_LIKE_AN_OFFICE_FOR.q, answers: whyLikeOffice, type: 'PROGRESS' },
          { question: LIKE_ABOUT_WORKING_FROM_OFFICE.q, answers: whatLikeWorkFromOffice, type: 'PROGRESS' },
          { question: ITEMS_WOULD_LIKE_TO_HAVE_IN_OFFICE.q, answers: itemsInOffice, type: 'PROGRESS' },
          { question: NOT_LIKE_ABOUT_WORKING_FROM_OFFICE.q, answers: notLikeWorkFromOffice, type: 'PROGRESS' },
          {
            question: MIND_IF_OFFICE_IS_SHARED.q,
            answers: [
              {
                yes: Number(wouldLikeOfficeIsShared),
                no: 100 - Number(wouldLikeOfficeIsShared),
              },
            ],
            type: 'MULTIPLE-PROGRESS',
          },
          {
            question: WOULD_NOT_LIKE_HOT_DESK_MODE.q,
            answers: [
              {
                yes: Number(wouldNotLikeHotDeskMode),
                no: 100 - Number(wouldNotLikeHotDeskMode),
              },
            ],
            type: 'MULTIPLE-PROGRESS',
          },
        ],
      });
    } catch (error) {
      loggerInstance.error('There was an error getting the employees summary section', error);
      return next(error);
    }
  }

  static async getRemoteWorkSummary(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const totalResponses = await FormService.getTotalResponses(req.params.formId);

      // summary percentage
      const { percentageWorkFromHome } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        IDEAL_NUMBER_OF_DAYS_WORK_FROM_HOME.q,
        '>= 1',
        'percentageWorkFromHome'
      );

      const { percentageWorkFromHomeWhithoutChanges } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        WORK_FROM_HOME_WHITHOUT_MAKING_CHANGES.q,
        "= 'Si'",
        'percentageWorkFromHomeWhithoutChanges'
      );

      // data res
      const likeWorkingFromHomeRes = await FormService.getSelectedAnswers(req.params.formId, LIKE_ABOUT_WORKING_HOME.q);
      const likeWorkingFromHomePercentages = responsesPercentage(likeWorkingFromHomeRes, totalResponses);
      const likeWorkingFromHome = await FormService.getAllOptionsForChart(
        likeWorkingFromHomePercentages,
        LIKE_ABOUT_WORKING_HOME.options
      );

      const notLikeWorkingFromHomeRes = await FormService.getSelectedAnswers(
        req.params.formId,
        NOT_LIKE_ABOUT_WORKING_HOME.q
      );
      const notLikeWorkingFromHomePercentages = responsesPercentage(notLikeWorkingFromHomeRes, totalResponses);
      const notLikeWorkingFromHome = await FormService.getAllOptionsForChart(
        notLikeWorkingFromHomePercentages,
        NOT_LIKE_ABOUT_WORKING_HOME.options
      );

      return res.send({
        topSummary: [
          {
            info: 'de sus empleados quiere trabajar desde casa al menos una vez a la semana.',
            percentage: percentageWorkFromHome,
          },
          {
            info: `Para hacer esto a largo plazo, el ${percentageWorkFromHomeWhithoutChanges}% dijo que necesitaría cambiar su configuración de trabajo de alguna manera.`,
            percentage: percentageWorkFromHomeWhithoutChanges,
          },
        ],
        data: [
          { question: LIKE_ABOUT_WORKING_HOME.q, answers: likeWorkingFromHome, type: 'PROGRESS' },
          { question: NOT_LIKE_ABOUT_WORKING_HOME.q, answers: notLikeWorkingFromHome, type: 'PROGRESS' },
          {
            question: WORK_FROM_HOME_WHITHOUT_MAKING_CHANGES.q,
            answers: [
              {
                yes: Number(percentageWorkFromHomeWhithoutChanges),
                no: 100 - Number(percentageWorkFromHomeWhithoutChanges),
              },
            ],
            type: 'MULTIPLE-PROGRESS',
          },
        ],
      });
    } catch (error) {
      loggerInstance.error('There was an error getting the remote work summary section', error);
      return next(error);
    }
  }

  static async getThirdSpacesSummary(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const totalResponses = await FormService.getTotalResponses(req.params.formId);

      // summary percentage
      const { workFromAnywhereIfCompanyPays } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        WORK_FROM_ANYWHERE_IF_COMPANY_PAYS.q,
        "= 'Si'",
        'workFromAnywhereIfCompanyPays'
      );

      const { percentageWorkFromAnywhere } = await FormService.getPercentageAnswerByCondition(
        req.params.formId,
        HOW_MANY_DAYS_WORK_FROM_ANYWHERE.q,
        '>= 1',
        'percentageWorkFromAnywhere'
      );

      // data res
      const whyChoseWorkFromOtherPlaceRes = await FormService.getSelectedAnswers(
        req.params.formId,
        WHY_CHOSE_WORK_FROM_OTHER_PLACE.q
      );
      const whyChoseWorkFromOtherPlacePercentages = responsesPercentage(whyChoseWorkFromOtherPlaceRes, totalResponses);
      const likeWorkingFromHome = await FormService.getAllOptionsForChart(
        whyChoseWorkFromOtherPlacePercentages,
        WHY_CHOSE_WORK_FROM_OTHER_PLACE.options
      );

      const whereCoworkLocatedRes = await FormService.getSelectedAnswers(
        req.params.formId,
        WHERE_WOULD_YOU_LIKE_COWORK_SPACE_TO_BE_LOCATED.q
      );
      const whereCoworkLocatedPercentages = responsesPercentage(whereCoworkLocatedRes, totalResponses);
      const whereCoworkLocated = await FormService.getAllOptionsForChart(
        whereCoworkLocatedPercentages,
        WHERE_WOULD_YOU_LIKE_COWORK_SPACE_TO_BE_LOCATED.options
      );

      return res.send({
        topSummary: [
          {
            info: 'De sus colaboradores desea trabajar desde un lugar que no sea la oficina principal de su empresa o su hogar al menos una vez a la semana. ',
            percentage: workFromAnywhereIfCompanyPays,
          },
          {
            info: 'dijo que trabajaría desde un espacio de coworking que no fuera la oficina principal de su empresa.',
            percentage: percentageWorkFromAnywhere,
          },
        ],
        data: [
          { question: WHY_CHOSE_WORK_FROM_OTHER_PLACE.q, answers: likeWorkingFromHome, type: 'PROGRESS' },
          {
            question: WORK_FROM_HOME_WHITHOUT_MAKING_CHANGES.q,
            answers: [
              {
                yes: Number(workFromAnywhereIfCompanyPays),
                no: 100 - Number(workFromAnywhereIfCompanyPays),
              },
            ],
            type: 'MULTIPLE-PROGRESS',
          },
          {
            question: WHERE_WOULD_YOU_LIKE_COWORK_SPACE_TO_BE_LOCATED.q,
            answers: whereCoworkLocated,
            type: 'PROGRESS',
          },
        ],
      });
    } catch (error) {
      loggerInstance.error('There was an error getting the third spaces summary section', error);
      return next(error);
    }
  }

  static async getCompanyFormDetails(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      const form = await CompanyForm.scope([{ method: ['byCompany', company.id] }]).findOne({
        where: { formId: req.params.formId },
      });

      return res.send({ name: form.formName, companyName: form['company.name'] });
    } catch (error) {
      loggerInstance.error('There was an error getting the form company details', error);
      return next(error);
    }
  }

  static async updateCompanyForm(req: Request<{ formId: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const company = await CompanyService.findCompanyByUserId(id);
      await CompanyForm.scope([{ method: ['byCompany', company.id] }]).update(req.body.payload, {
        where: { formId: req.params.formId },
      });

      return res.send({});
    } catch (error) {
      loggerInstance.error('There was an error updating the form company details', error);
      return next(error);
    }
  }
}
