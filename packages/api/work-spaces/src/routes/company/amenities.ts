import express from 'express';
import CompanyController from '../../controllers/company';

const companyAmenitiesRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 * /companies/{companyId}/amenities:
 *   get:
 *     tags:
 *       - Company
 *       - Amenity
 *     summary: Get amenities by company
 *     parameters:
 *       - in: path
 *         name: companyId
 *     responses:
 *      200:
 *        description: Successfully get amenities by company
 */
companyAmenitiesRouter.get('/', CompanyController.getAmenities);

/**
 * @swagger
 * /companies/{companyId}/amenities:
 *   post:
 *     tags:
 *       - Company
 *       - Amenity
 *     summary: Create amenity in company
 *     parameters:
 *       - in: path
 *         name: companyId
 *     responses:
 *      200:
 *        description: Successfully created amenities in company
 */
companyAmenitiesRouter.post('/', CompanyController.createAmenity);

/**
 * @swagger
 * /companies/{companyId}/amenities/{amenityId}:
 *   patch:
 *     tags:
 *       - Company
 *       - Amenity
 *     summary: Edit amenity of company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: path
 *         name: amenityId
 *     responses:
 *      200:
 *        description: Successfully updated amenity of company
 */
companyAmenitiesRouter.patch('/:amenityId', CompanyController.editAmenity);

/**
 * @swagger
 * /companies/{companyId}/amenities/{amenityId}:
 *   delete:
 *     tags:
 *       - Company
 *       - Amenity
 *     summary: Delete amenity from company
 *     parameters:
 *       - in: path
 *         name: companyId
 *       - in: path
 *         name: amenityId
 *     responses:
 *      200:
 *        description: Successfully deleted amenity from company
 */
companyAmenitiesRouter.delete('/:amenityId', CompanyController.deleteAmenity);

export default companyAmenitiesRouter;
