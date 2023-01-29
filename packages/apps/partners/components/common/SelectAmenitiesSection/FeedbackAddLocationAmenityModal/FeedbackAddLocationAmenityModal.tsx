import { useRouter } from 'next/router';
import { Button, Input, LoadingSpinner, Modal, Amenity } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import useCreateLocationAmenity from '../../../../hooks/api/useCreateLocationAmenity';

const StyledModal = styled(Modal)`
  > div > div {
    padding: 76px 127px;
  }
`;

const StyledTitle = styled.h6`
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledInput = styled(Input)`
  margin-top: 48px;
  margin-bottom: 72px;
  align-items: flex-start;

  input {
    width: 410px;
  }
`;

const validationSchema = Yup.object().shape({
  amenityName: Yup.string()
    .trim()
    .ensure()
    .required('El nombre del amenity es requerido.')
    .min(4, 'El nombre del amenity debe tener al menos 4 caracteres.')
    .max(30, 'El nombre del amenity no puede tener más de 30 caracteres.')
    .transform(v => v[0].toUpperCase() + v.slice(1)),
});

type Props = {
  onClose?: () => void;
  onConfirm?: (newAmenity?: Amenity) => void;
};

export default function FeedbackAddLocationAmenityModal({ onClose, onConfirm }: Props) {
  const { query } = useRouter();
  const mutation = useCreateLocationAmenity(query.locationId as string);

  const formik = useFormik({
    initialValues: { amenityName: '' },
    validationSchema,
    onSubmit: async (_values, _formik) => {
      try {
        const name = validationSchema.cast(_values).amenityName;
        const { amenity } = await mutation.mutateAsync({ name });
        onConfirm?.(amenity);
      } catch (_) {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
      onClose?.();
    },
  });

  return (
    <StyledModal onClose={onClose} variant='light'>
      <FormikProvider value={formik}>
        <StyledTitle>Agregar amenities</StyledTitle>
        <StyledInput label='Nueva amenity' placeholder='Gimnasio' name='amenityName' />
        <Button
          variant='primary'
          onClick={() => formik.submitForm()}
          trailingIcon={formik.isSubmitting ? <LoadingSpinner /> : undefined}
          disabled={formik.isSubmitting}>
          Agregar
        </Button>
      </FormikProvider>
    </StyledModal>
  );
}
