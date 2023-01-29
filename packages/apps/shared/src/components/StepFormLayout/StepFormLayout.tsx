import styled from 'styled-components';
import { Form } from 'formik';
import Steps from './Steps';
import { images } from '../../assets';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import BaseHeaderTitle from '../BaseHeaderTitle';

const StyledWrapper = styled(Form)`
  padding: 72px 75px;
  padding-right: 0;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
  row-gap: 50px;
`;

const StyledGrid = styled.div`
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1fr max-content;
  grid-template-rows: max-content minmax(179px, max-content);
  row-gap: 48px;
  column-gap: 50px;
`;

const StyledContent = styled.div`
  grid-column-start: 1;
  grid-row-start: 2;
`;

const StyledBtnContainer = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const IconHouse = styled(images.House)`
  width: 20px;
  height: 20px;
`;

type Props = {
  customHeader?: React.ReactNode;
  primaryText?: string;
  secondaryText?: string;
  children?: React.ReactNode;
  steps: {
    id: number;
    label: string;
    status?: string;
    sidebarChildren?: React.ReactNode;
  }[];
  current: number;
  onPreviousClick?: () => void;
  onSetActive?: (step: number) => void;
  nextButtonDisabled?: boolean;
  showFinishButton?: boolean;
  onClickLeftButton?: () => void;
  leftButtonText?: string;
  hideButtons?: boolean;
  hideSteps?: boolean;
};

export default function StepFormLayout({
  customHeader,
  primaryText,
  secondaryText,
  children,
  steps,
  current,
  onPreviousClick,
  onSetActive,
  nextButtonDisabled,
  showFinishButton,
  onClickLeftButton,
  leftButtonText,
  hideButtons,
  hideSteps = false,
}: Props) {
  return (
    <StyledWrapper>
      <StyledGrid>
        {customHeader || <BaseHeaderTitle primaryText={primaryText} secondaryText={secondaryText} />}
        <StyledContent>{children}</StyledContent>
        {!hideSteps && (
          <Steps steps={steps} currentStep={current} onPreviousStep={onPreviousClick} setCurrentStep={onSetActive} />
        )}
      </StyledGrid>
      {!hideButtons && (
        <StyledBtnContainer>
          <Button variant='outline' trailingIcon={<IconHouse />} onClick={onClickLeftButton}>
            {leftButtonText}
          </Button>
          <Button
            type='submit'
            trailingIcon={nextButtonDisabled ? <LoadingSpinner /> : undefined}
            disabled={nextButtonDisabled}>
            {!showFinishButton ? 'Siguiente' : 'Finalizar'}
          </Button>
        </StyledBtnContainer>
      )}
    </StyledWrapper>
  );
}
