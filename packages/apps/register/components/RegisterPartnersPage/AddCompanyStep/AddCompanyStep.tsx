import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { Input, Label, Select, Button } from '@wimet/apps-shared';
import type { RegisterInitialValues } from '../../../pages/register/partners';
import Layout from '../../UI/Layout';
import useGetCompanyTypes from '../../../hooks/api/Location/useGetCompanyTypes';
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

const StyledInputGrid = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  row-gap: 32px;

  & > * {
    flex-shrink: 0;
    min-height: 0;
    min-width: 0;
  }
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

type Props = {
  isSubmitting?: boolean;
  onSelectOtherCountry?: () => void;
};

export default function AddCompanyStep({ isSubmitting, onSelectOtherCountry }: Props) {
  const { values, setFieldValue } = useFormikContext<RegisterInitialValues>();
  const { data: companyTypes = [] } = useGetCompanyTypes({
    select: dataCompanyTypes =>
      dataCompanyTypes.map(({ value, id, ...companyType }) => ({
        ...companyType,
        label: value,
        value: id,
      })),
  });
  const { countries, selectedCountry } = useGetCitiesByCountry({
    countryId: values.company.country,
    onCitiesChange: (_selectedCountry, cities) => {
      if (_selectedCountry.value === -1) return onSelectOtherCountry?.();
      return setFieldValue('company.stateId', cities[0].value);
    },
  });

  return (
    <Layout
      title='Wimet | Register Partner'
      sidebarTitle='Quiero publicar mi espacio'
      sidebarDescription='Vamos a necesitar que nos compartas información del lugar donde están alojados los espacios a cargar.'>
      <StyledWrapper>
        <Label text='Datos de la empresa' variant='tertiary' size='xlarge' lowercase />
        <StyledInputGrid>
          <Input label='Nombre' placeholder='Tu empresa' name='company.name' />
          <Select label='Tipo' options={companyTypes} instanceId='Tipo' name='company.companyTypeId' />
          <Select label='País' options={countries} instanceId='País' name='company.country' />
          <Select label='Ciudad' options={selectedCountry.states} instanceId='Ciudad' name='company.stateId' />
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
