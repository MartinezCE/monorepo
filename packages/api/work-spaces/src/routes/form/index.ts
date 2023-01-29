import express from 'express';
import FormController from '../../controllers/form';

const formRouter = express.Router({ mergeParams: true });

formRouter.post('/', FormController.insetAnswers);
formRouter.get('/', FormController.getCompanyForms);

formRouter.get('/:formId', FormController.getCompanyFormDetails);
formRouter.patch('/:formId', FormController.updateCompanyForm);
formRouter.delete('/:formId', FormController.deleteCompanyForm);

formRouter.get('/:formId/summary/general-peek', FormController.getSummarySection);
formRouter.get('/:formId/summary/choice-of-workplace', FormController.getChoiceOfWorkplaceSummary);
formRouter.get('/:formId/summary/employees-preferences', FormController.getEmployeesPreferencesSummary);
formRouter.get('/:formId/summary/remote-work', FormController.getRemoteWorkSummary);
formRouter.get('/:formId/summary/third-spaces', FormController.getThirdSpacesSummary);

formRouter.post('/collaborators', FormController.duplicateCollaboratorsForm);

export default formRouter;
