import express from 'express';
import CountryController from '../../controllers/country';

const countryRouter = express.Router();

countryRouter.get('/', CountryController.getCountries);
countryRouter.get('/:companyId/states', CountryController.getAllStates);

export default countryRouter;
