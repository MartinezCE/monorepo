import { mergeSchemas } from '@wimet/apps-shared';
import * as Yup from 'yup';

const validationSchemas = [
  Yup.object().shape({
    name: Yup.string().required('Este campo es obligatorio').ensure(),
    spaceReservationTypeId: Yup.number().required(),
    area: Yup.string().required('Este campo es obligatorio').ensure(),
    spaceTypeId: Yup.number().required('Este campo es obligatorio'),
    peopleCapacity: Yup.string().required('Este campo es obligatorio').ensure(),
  }),
];

export default validationSchemas;
export const schemas: Yup.BaseSchema<
  Yup.TypeOf<typeof validationSchemas[number]>,
  Yup.SchemaOf<typeof validationSchemas[number], never>,
  Yup.Asserts<typeof validationSchemas[number]>
> = mergeSchemas(validationSchemas);
