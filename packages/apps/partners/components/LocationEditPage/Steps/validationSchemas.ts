import { mergeSchemas } from '@wimet/apps-shared';
import * as Yup from 'yup';

const validationSchemas = [
  Yup.object().shape({
    address: Yup.string()
      .ensure()
      .trim()
      .required('Dirección válida requerida')
      .when('isAddressValid', {
        is: false,
        then: Yup.string().test({
          message: 'Seleccione una dirección válida de la lista de sugerencias',
          test: () => false,
        }),
      }),
    city: Yup.string().nullable(),
    country: Yup.string().nullable(),
    state: Yup.string().nullable(),
    postalCode: Yup.string().nullable(),
    streetName: Yup.string().nullable(),
    streetNumber: Yup.string().nullable(),
    description: Yup.string()
      .ensure()
      .trim()
      .required('Descripción requerida')
      .min(10, 'Descripción mínima de 10 caracteres'),
    stateId: Yup.number().nullable(),
    name: Yup.string().required('Nombre requerido'),
  }),
  Yup.object().shape({
    imageQuantity: Yup.number().min(4, 'Son necesarias 4 imagenes como mínimo'),
    tourUrl: Yup.string()
      .nullable()
      .ensure()
      .trim()
      .url('URL inválida')
      .matches(
        /^$|(https?:\/\/)?(www\.)?my\.matterport\.com\/show\/\?m=.{11}?(?=[^a-zA-Z0-9]|$)/gm,
        'No es una url matterport válida'
      ),
  }),
  Yup.object().shape({
    amenities: Yup.array()
      .nullable()
      .ensure()
      .of(
        Yup.object().shape({
          id: Yup.number().required(),
          name: Yup.string().required(),
          isDefault: Yup.boolean().required(),
        })
      ),
  }),
  Yup.object().shape({
    accessCode: Yup.string()
      .nullable()
      .ensure()
      .trim()
      .matches(/^([0-9]{4})?$/gm, 'El código debe de ser numérico y de 4 carácteres'),
    comments: Yup.string()
      .nullable()
      .ensure()
      .trim()
      .test({
        message: 'Comentarios mínimo de 4 caracteres',
        test: v => {
          const value = v.trim();
          return value === '' || value.length > 3;
        },
      }),
  }),
];

export default validationSchemas;
export const schemas: Yup.BaseSchema<
  Yup.TypeOf<typeof validationSchemas[number]>,
  Yup.SchemaOf<typeof validationSchemas[number], never>,
  Yup.Asserts<typeof validationSchemas[number]>
> = mergeSchemas(validationSchemas);
