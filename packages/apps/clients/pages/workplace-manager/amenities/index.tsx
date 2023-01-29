import { BaseHeaderTitle, Button, DeleteBaseModal, Input, LoadingSpinner, Pill, useGetMe } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useState } from 'react';
import styled from 'styled-components';
import Layout from '../../../components/Layout';
import useCreateCompanyAmenity from '../../../hooks/api/useCreateCompanyAmenity';
import useDeleteCompanyAmenity from '../../../hooks/api/useDeleteCompanyAmenity';
import useEditCompanyAmenity from '../../../hooks/api/useEditCompanyAmenity copy';
import useGetCompanyAmenities from '../../../hooks/api/useGetCompanyAmenities';

const StyledWrapper = styled.div`
  width: 494px;
  display: flex;
  flex-direction: column;
  margin: 72px;
`;

const StyledDescription = styled.p`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  margin: 48px 0px;
`;

const StyledButton = styled(Button)`
  margin-top: 32px;
  margin-bottom: 56px;
  width: fit-content;
`;

const StyledPillWrapper = styled.div`
  display: flex;
  margin: 40px 0px;
  gap: 16px;
  flex-wrap: wrap;
`;

const StyledPill = styled(Pill)`
  background-color: ${({ theme: { colors } }) => colors.lightGray};
`;

export default function AmenitiesPage() {
  const [deleteAmenityModal, setDeleteAmenityModal] = useState<{ show: boolean; id?: number }>({ show: false });
  const { data: userData } = useGetMe();
  const { data = [] } = useGetCompanyAmenities(Number(userData?.companies[0].id));
  const { mutateAsync: createAmenity, isLoading } = useCreateCompanyAmenity(Number(userData?.companies[0].id));
  const { mutateAsync: deleteAmenity } = useDeleteCompanyAmenity(Number(userData?.companies[0].id));
  const { mutateAsync: editAmenity } = useEditCompanyAmenity(Number(userData?.companies[0].id));

  const formik = useFormik({
    initialValues: { amentiy: '', search: '' },
    onSubmit: () => {},
  });

  const handleAddAmentiy = async () => {
    await createAmenity({ name: formik.values.amentiy });
    formik.setFieldValue('amentiy', '');
  };
  const handleEditAmenity = async (id: number, name: string, newName: string) => {
    if (name === newName) return;
    await editAmenity({ id, name: newName });
  };
  const handleDeleteAmentiy = async (id: number) => deleteAmenity(id);
  const handleCancelDeleteAmentiy = () => setDeleteAmenityModal({ show: false });

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <BaseHeaderTitle primaryText='Amenities' />
          <StyledDescription>
            Carga amenities de tus espacios para luego poder asignarlas a cada lugar dentro de los planos. Por zonas de
            oficinas, lugares con sillas ergonómicas, etc.
          </StyledDescription>
          <Input label='Característica' name='amentiy' placeholder='Sillas ergonómicas' />
          <StyledButton
            onClick={handleAddAmentiy}
            disabled={isLoading}
            trailingIcon={isLoading ? <LoadingSpinner /> : undefined}>
            Agregar
          </StyledButton>
          <Input label='Amenities cargadas' name='search' placeholder='Buscar por nombre' />
          <StyledPillWrapper>
            {data
              .filter(a => a.name.toLowerCase().includes(formik.values.search))
              .map(amenity => (
                <StyledPill
                  key={amenity.id}
                  text={amenity.name}
                  isEditable
                  onEditText={({ text }) => handleEditAmenity(amenity.id, amenity.name, text.trim())}
                  onClickClose={() => setDeleteAmenityModal({ show: true, id: amenity.id })}
                />
              ))}
          </StyledPillWrapper>
        </StyledWrapper>
      </FormikProvider>
      {deleteAmenityModal.show && (
        <DeleteBaseModal
          title='¿Eliminar característica?'
          text='Si lo haces, se eliminará de todos los lugares donde está asignada.'
          onClose={handleCancelDeleteAmentiy}
          onCancel={handleCancelDeleteAmentiy}
          onConfirm={() => handleDeleteAmentiy(Number(deleteAmenityModal.id))}
        />
      )}
    </Layout>
  );
}
