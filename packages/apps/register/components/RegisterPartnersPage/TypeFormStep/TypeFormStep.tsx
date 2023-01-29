import { Widget } from '@typeform/embed-react';
import { Label } from '@wimet/apps-shared';
import styled from 'styled-components';
import Layout from '../../UI/Layout';

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 73px;
  padding-left: 73px;
  padding-bottom: 68px;
`;

const StyledWidget = styled(Widget)`
  margin-top: 16px;
  height: 100%;
`;

export default function TypeFormStep() {
  return (
    <Layout
      title='Wimet | Register Partner'
      sidebarTitle='Quiero publicar mi espacio'
      sidebarDescription='Vamos a necesitar que nos compartas información del lugar donde están alojados los espacios a cargar.'>
      <StyledWrapper>
        <Label text='Typeform' variant='tertiary' size='xlarge' lowercase />
        <StyledWidget id='WdIk1ynB' />
      </StyledWrapper>
    </Layout>
  );
}
