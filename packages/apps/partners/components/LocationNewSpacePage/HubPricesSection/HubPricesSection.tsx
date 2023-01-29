import { InnerStepFormLayout } from '@wimet/apps-shared';
import styled from 'styled-components';
import LeftSideInputs from './LeftSideInputs';
import RightSideSwitches from './RightSideSwitches';

const StyledInnerStepFormLayout = styled(InnerStepFormLayout)`
  max-width: 750px;
`;

const StyledWrapper = styled.div`
  margin-top: 46px;
  display: grid;
  grid-template-columns: minmax(0, 380px) auto;
  column-gap: 56px;
`;

type Props = {
  description: string;
};

export default function HubPricesSection({ description }: Props) {
  return (
    <StyledInnerStepFormLayout label='Precio y Términos' description={description}>
      <StyledWrapper>
        <LeftSideInputs />
        <RightSideSwitches />
      </StyledWrapper>
    </StyledInnerStepFormLayout>
  );
}
