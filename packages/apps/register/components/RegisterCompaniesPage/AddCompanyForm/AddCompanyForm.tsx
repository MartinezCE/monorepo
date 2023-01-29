import { Button, Input, Link, Select, TitleEditable, images, InputNumber } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import AddAvatar from '../../UI/AddAvatar';
import type { RegisterClientsInitialValues } from '../../../pages/register/clients';
import Layout from '../../UI/Layout';
import useGetCitiesByCountry from '../../../hooks/useGetCitiesByCountry';

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 73px;
  padding-left: 73px;
  padding-bottom: 68px;
`;

const FormHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const FormTitleContainer = styled.div`
  margin-left: 32px;
`;

const StyledInputGrid = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 32px;
`;

const ReturnRow = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: flex-end;
`;

const StyledButtonWrapper = styled.div`
  height: 100%;
  margin-top: 32px;
  display: flex;
  align-items: flex-end;
`;

const StyledButton = styled(Button)`
  width: fit-content;
  margin-left: auto;
`;

const StyledLinkIcon = styled(Link)`
  border-radius: 4px;
  padding: 4px;
`;

type Props = {
  isSubmitting?: boolean;
};

export default function AddCompanyForm({ isSubmitting }: Props) {
  const { values, setFieldValue } = useFormikContext<RegisterClientsInitialValues>();
  const { countries, selectedCountry } = useGetCitiesByCountry({
    countryId: values.company.country,
    onCitiesChange: (_, cities) => setFieldValue('company.stateId', cities[0].value),
  });

  return (
    <Layout
      title='Wimet | Register Company'
      sidebarTitle='Registra tu empresa'
      sidebarDescription='Vamos a necesitar que nos compartas información de la compañía para la que trabajas.'>
      <StyledWrapper>
        <ReturnRow>
          <StyledLinkIcon href='/' variant='secondary' leadingIcon={<images.ChevronLeft />} />
        </ReturnRow>
        <FormHeader>
          <AddAvatar color='client' />
          <FormTitleContainer>
            <TitleEditable
              names={['company.name']}
              placeholders={['Empresa']}
              buttonVariant='secondary'
              buttonLeftSeparation={24}
            />
          </FormTitleContainer>
        </FormHeader>
        <StyledInputGrid>
          <Select label='País' options={countries} instanceId='País' name='company.country' />
          <Select label='Ciudad' options={selectedCountry.states} instanceId='Ciudad' name='company.stateId' />
          <InputNumber label='Cantidad de colaboradores' name='company.peopleAmount' placeholder='0' min={1} />
          <Input label='Website' placeholder='tudominio.com' name='company.websiteUrl' />
        </StyledInputGrid>
        <StyledButtonWrapper>
          <StyledButton type='submit' disabled={isSubmitting}>
            Siguiente
          </StyledButton>
        </StyledButtonWrapper>
      </StyledWrapper>
    </Layout>
  );
}
