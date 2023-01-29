import React, { useMemo, useState } from 'react';
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
  UserRole,
  DeleteContactModal,
  useGetCountries,
  GET_COUNTRIES,
  getCountries,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import useUpdateUser, { UpdateUserPayload } from '@wimet/apps-shared/lib/hooks/api/useUpdateUser';
import Layout from '../../components/UI/Layout';

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
  const { data: countries } = useGetCountries({
    select: item =>
      item.map(val => ({
        ...val,
        label: val.name,
        value: val.name,
      })),
  });
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
  const cities = useMemo(
    () =>
      countries
        ?.find(item => item.name === formik.values.country)
        ?.states.map(value => ({ ...value, label: value.name, value: value.name })),
    [countries, formik]
  );

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
              options={countries}
              instanceId='countryOptions'
              name='country'
              placeholder='Agrega un pais'
            />
            <Select
              label='Ciudad'
              options={cities}
              instanceId='ciudadOptions'
              name='ciudad'
              placeholder='Agrega una ciudad'
            />
            {/*   <Select
              label='Rol en la empresa'
              options={ROLE_OPTIONS}
              instanceId='roleOptions'
              name='role'
              placeholder='Account Manager'
            /> */}
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

  await Promise.all([
    queryClient.prefetchQuery(GET_COUNTRIES, getCountries),
    queryClient.prefetchQuery(GET_ME, () => getMe(context.req.headers as AxiosRequestHeaders)),
  ]);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default ProfilePage;
