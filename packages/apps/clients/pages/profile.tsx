import React, { useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import {
  Button,
  DatePickerInput,
  Input,
  Profile,
  Select,
  images,
  useGetMe,
  GET_ME,
  getMe,
  getUserRoleLabels,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { UserRole } from '@wimet/apps-shared/src/utils/enums';
import { COUNTRY_OPTIONS, PROVINCE_OPTIONS, ROLE_OPTIONS } from '../mocks';
import DeleteContactModal from '../components/DeleteContactModal';
import Layout from '../components/Layout';
import useUpdateUser, { UpdateUserPayload } from '../hooks/api/useUpdateUser';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 64px 251px 140px 76px;
`;

const StyledHeader = styled.div`
  display: flex;
  margin-bottom: 46px;
`;

const StyledFieldsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
`;

const StyledFooter = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;

const StyledDeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.error};
`;

const StyledDeleteText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 24px;
`;

const ProfilePage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: profileData } = useGetMe();
  const { mutateAsync } = useUpdateUser();
  const formik = useFormik({
    initialValues: {
      name: profileData?.firstName,
      lastName: profileData?.lastName,
      birthdate: null,
      role: getUserRoleLabels(profileData?.userRole?.value as UserRole),
      country: null,
      province: null,
      phone: profileData?.phoneNumber,
    },
    onSubmit: () => {},
  });

  const handleSubmit = async () => {
    const { name, lastName, phone, role } = formik.values;
    await mutateAsync({
      firstName: name,
      lastName,
      phoneNumber: phone,
      userRole: {
        value: role,
      },
    } as UpdateUserPayload);
  };

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <StyledHeader>
            <Profile
              name='Litebox'
              textPosition='right'
              size='large'
              variant='sky'
              showUserLabel={false}
              transparent
              onClickAdd={() => {}}
            />
          </StyledHeader>
          <StyledFieldsWrapper>
            <Input label='Nombre' placeholder='Federico' name='name' />
            <Input label='Apellido' placeholder='Pérez' name='lastName' />
            <Select
              label='País'
              options={COUNTRY_OPTIONS}
              instanceId='countryOptions'
              name='country'
              placeholder='Argentina'
            />
            <Select
              label='Provincia'
              options={PROVINCE_OPTIONS}
              instanceId='provinceOptions'
              name='province'
              placeholder='Buenos Aires'
            />
            <Select
              label='Rol en la empresa'
              options={ROLE_OPTIONS}
              instanceId='roleOptions'
              name='role'
              placeholder='Account Manager'
            />
            <DatePickerInput label='Fecha de nacimiento' placeholder='16/01/1995' name='birthdate' />
            <Input label='Teléfono' placeholder='11 4637 4380' name='phone' />
          </StyledFieldsWrapper>
          <StyledFooter>
            <StyledDeleteButton
              variant='transparent'
              onClick={() => setShowDeleteModal(true)}
              trailingIcon={<images.TinyBin />}>
              Eliminar cuenta
            </StyledDeleteButton>
            <Button variant='primary' type='submit' onClick={handleSubmit} disabled={formik.isSubmitting}>
              Guardar cambios
            </Button>
          </StyledFooter>
        </StyledWrapper>
        {showDeleteModal && (
          <DeleteContactModal onClickClose={() => setShowDeleteModal(false)}>
            <StyledDeleteText>
              <div>Si la eliminas no tendrás más acceso a Wimet. Deberán invitarte nuevamente para poder ingresar.</div>
              <div>Recuerda que esta acción no se puede deshacer.</div>
            </StyledDeleteText>
          </DeleteContactModal>
        )}
      </FormikProvider>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GET_ME, () => getMe(context.req.headers as AxiosRequestHeaders));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default ProfilePage;
