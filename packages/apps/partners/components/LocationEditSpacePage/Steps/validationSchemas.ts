import { mergeSchemas, SpaceReservationType } from '@wimet/apps-shared';
import * as Yup from 'yup';

const commonSchema = {
  name: Yup.string()
    .required('El nombre es requerido')
    .min(4, 'El nombre debe contener al menos 4 carácteres de largo'),
};

const validationSchemas = [
  Yup.object().shape({
    ...commonSchema,
    spaceOfferId: Yup.number().nullable(),
    name: Yup.string().required('Este campo es obligatorio').ensure(),
    spaceReservationTypeId: Yup.mixed().required(),
    spaceReservationType: Yup.string().required(),
    area: Yup.string().required('Este campo es obligatorio').ensure(),
    spaceTypeId: Yup.number().required('Este campo es obligatorio'),
    peopleCapacity: Yup.string().required('Este campo es obligatorio').ensure(),
  }),
  Yup.object().shape({
    ...commonSchema,
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
    ...commonSchema,
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
    hourly: Yup.array()
      .nullable()
      .of(
        Yup.object().shape({
          price: Yup.number().min(0, 'El precio debe ser mayor o igual a 0').required('Este campo es obligatorio'),
          halfDayprice: Yup.number().min(0, 'El precio debe ser mayor o igual a 0'),
          fullDayPrice: Yup.number().min(0, 'El precio debe ser mayor o igual a 0'),
          minHoursAmount: Yup.number()
            .min(1, 'La cantidad de horas mínimas debe ser mayor o igual a 1')
            .required('Este campo es obligatorio'),
          dayOfWeek: Yup.number()
            .min(0, 'El día de la semana debe ser mayor a 0')
            .max(6, 'El día de la semana debe ser menor o igual a 7'),
        })
      ),
    monthly: Yup.object()
      .nullable()
      .default(null)
      .shape({
        price: Yup.number()
          .min(0, 'El precio debe ser mayor o igual a 0')
          .nullable()
          .transform(v => v || null),
        minMonthsAmount: Yup.number().min(1, 'La cantidad de meses mínimos debe ser mayor o igual a 1').nullable(),
        maxMonthsAmount: Yup.number().min(1, 'La cantidad de meses máximos debe ser mayor o igual a 1').nullable(),
        spaceDepositId: Yup.number().nullable(),
        spaceDiscounts: Yup.array()
          .nullable()
          .default(null)
          .of(
            Yup.object()
              .nullable()
              .default(null)
              .shape({
                percentage: Yup.number()
                  .required('El porcentaje es obligatorio')
                  .min(0, 'El porcentaje debe ser mayor o igual a 0'),
                spaceDiscountId: Yup.number(),
              })
          ),
      }),
  }),
  Yup.object().shape({
    schedule: Yup.array()
      .nullable()
      .when('spaceReservationType', {
        is: SpaceReservationType.HOURLY,
        then: Yup.array()
          .min(Yup.ref('hourly.length'), 'Debe haber al menos una disponibilidad por precio')
          .max(Yup.ref('hourly.length'), 'Debe haber al menos una disponibilidad por precio'),
      })
      .of(
        Yup.object()
          .shape({
            openTime: Yup.string().required('Este campo es obligatorio'),
            closeTime: Yup.string().required('Este campo es obligatorio'),
            is24Open: Yup.boolean().required('Este campo es obligatorio'),
          })
          .test('close-time-is24Open', (value, ctx) => {
            const { openTime, closeTime, is24Open } = value;

            if (!is24Open && openTime === closeTime) {
              return ctx.createError({
                path: `${ctx.path}.isHourValid`,
                message: 'Debe haber una disponibilidad horaria o marcar como disponible las 24hs',
              });
            }
            return true;
          })
      ),
  }),
];

export default validationSchemas;
export const schemas: Yup.BaseSchema<
  Yup.TypeOf<typeof validationSchemas[number]>,
  Yup.SchemaOf<typeof validationSchemas[number], never>,
  Yup.Asserts<typeof validationSchemas[number]>
> = mergeSchemas(validationSchemas);
