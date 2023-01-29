import { useMemo } from 'react';
import {
  Button,
  getMe,
  GET_ME,
  Input,
  Profile,
  Select,
  TitleEditable,
  useGetMe,
  useGetCountries,
  InputNumber,
} from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import { GetServerSidePropsContext } from 'next';
// import ContactInfoCard from '../../components/AccountPage/ContactInfoCard';
import Layout from '../../../components/Layout';
import { ACCOUNT_CITY_OPTIONS, ACCOUNT_COUNTRIES_OPTIONS } from '../../../mocks';
// import EditContactModal from '../../components/AccountPage/EditContactModal';
import useUpdateCompany, { UpdateCompanyPayload } from '../../../hooks/api/useUpdateCompany';

const StyledWrapper = styled.div`
  padding: 64px 355px 64px 75px;
`;
const StyledHeader = styled.div`
  display: flex;
  align-items: center;
`;

const StyledNameContainer = styled.div`
  margin-left: 32px;
`;

const StyledFormContainer = styled.div`
  display: grid;
  margin-top: 48px;
  margin-bottom: 40px;
  gap: 40px;
  grid-template-columns: 1fr 1fr;
`;

// const StyledContactInfoWrapper = styled.div`
//   margin-top: 80px;
// `;

// const StyledTitle = styled.div`
//   font-size: 16px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.colors.blue};
//   margin-bottom: 20px;
// `;

// const StyledCardsWrapper = styled.div`
//   display: grid;
//   gap: 40px;
//   grid-template-columns: 1fr 1fr;
// `;

const AccountPage = () => {
  // const [showEditContact, setShowEditContact] = useState<any | null>();
  const { data: user } = useGetMe();
  const company = user?.companies[0];
  const { mutateAsync } = useUpdateCompany(company?.id as number);
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
      name: company?.name || 'Litebox',
      country: company?.state.country?.name || ACCOUNT_COUNTRIES_OPTIONS[0].value,
      city: company?.state.name || ACCOUNT_CITY_OPTIONS[0].value,
      peopleAmount: company?.peopleAmount || 0,
      websiteUrl: company?.websiteUrl || '',
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
    const { city: cityVal, name, websiteUrl, peopleAmount } = formik.values;
    const city = cities?.find(item => item.name === cityVal);
    const payload = {
      name: name || undefined,
      websiteUrl: websiteUrl || undefined,
      peopleAmount,
      stateId: city?.id,
    };
    await mutateAsync(payload as UpdateCompanyPayload);
  };

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <StyledHeader>
            <Profile
              textPosition='right'
              size='large'
              variant='blue'
              showUserLabel={false}
              transparent
              onClickAdd={() => {}}
            />
            <StyledNameContainer>
              <TitleEditable names={['name']} buttonVariant='secondary' buttonLeftSeparation={32} />
            </StyledNameContainer>
          </StyledHeader>
          <StyledFormContainer>
            <Select label='País' options={countries} instanceId='countryOptions' name='country' isDisabled />
            <Select label='Ciudad' options={cities} instanceId='cityOptions' name='city' />
            <InputNumber label='Cantidad de colaboradores' name='peopleAmount' placeholder='12' type='number' min={0} />
            <Input label='Website' name='websiteUrl' placeholder='www.litebox.ai' />
          </StyledFormContainer>
          <Button type='submit' variant='primary' disabled={formik.isSubmitting} onClick={handleSubmit}>
            Guardar cambios
          </Button>
          {/* <StyledContactInfoWrapper>
            <StyledTitle>Datos de contacto</StyledTitle>
            <StyledCardsWrapper>
              {ACCOUNT_CONTACT_INFO.map(item => (
                <ContactInfoCard
                  key={item.id}
                  name={item.name}
                  lastname={item.lastname}
                  position={item.position}
                  image={item.image || ''}
                  onClickEdit={() => setShowEditContact(item)}
                />
              ))}
            </StyledCardsWrapper>
            {showEditContact && (
              <EditContactModal onClickClose={() => setShowEditContact(null)} contactData={showEditContact} />
            )}
          </StyledContactInfoWrapper> */}
        </StyledWrapper>
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

export default AccountPage;
