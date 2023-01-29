import React from 'react';
import styled from 'styled-components';
import { images } from '../../../assets';
import Button from '../../Button';
import Text from '../../Text';

enum Status {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  INCOMPLETE = 'incomplete',
}

const StyledStepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 56px;
`;

type StyledWrapperProps = {
  percentage: number;
};

const StyledStepsInnerWrapper = styled.div<StyledWrapperProps>`
  min-width: 179px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  height: max-content;
  position: relative;
  &::before {
    content: '';
    background: ${({ theme, percentage }) =>
      `
      linear-gradient(to bottom, ${theme.colors.darkBlue} 0 ${percentage}%, ${theme.colors.lightBlue} ${percentage}% ${
        100 - percentage
      }%);
    `};
    width: 2px;
    height: 100%;
    position: absolute;
    left: 0;
  }
`;

const StyledTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledTitle = styled.span`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const StyledPreviousArrowButton = styled(Button)`
  width: 34px;
  height: 34px;
  padding: 0;
  justify-content: center;
  margin-left: 24px;
`;

const IconArrowRight = styled(images.ArrowRight)`
  width: 20px;
  height: 20px;
  transform: rotate(180deg);
`;

const StyledStepButton = styled(Button)`
  margin: 12px 0;
  display: flex;
  align-items: center;
  width: fit-content;
  color: ${({ theme }) => theme.colors.darkBlue};

  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledCheckIcon = styled(images.Check)`
  width: 18px;
  height: 18px;
`;

type StylesStepLabelProps = {
  status: Status;
};

const StylesStepLabel = styled(Text)<StylesStepLabelProps>`
  color: ${({ theme, status }) => {
    if (status === Status.INCOMPLETE) {
      return theme.colors.lightBlue;
    }
    if (status === Status.ACTIVE) {
      return theme.colors.blue;
    }
    return theme.colors.darkBlue;
  }};
  font-weight: ${({ theme, status }) => (status === Status.INCOMPLETE ? theme.fontWeight[0] : theme.fontWeight[3])};
`;

type StepsProps = {
  steps: {
    id: number;
    label: string;
    status?: string;
    sidebarChildren?: React.ReactNode;
  }[];
  currentStep: number;
  onPreviousStep?: () => void;
  setCurrentStep?: (value: number) => void;
};

const Steps: React.FC<StepsProps> = ({ steps, currentStep, onPreviousStep, setCurrentStep }) => {
  const getStatus = (stepIndex: number) => {
    if (stepIndex === currentStep) {
      return Status.ACTIVE;
    }
    if (stepIndex > currentStep) {
      return Status.INCOMPLETE;
    }
    return Status.COMPLETED;
  };

  const isFirstStep = currentStep === 0;
  const percentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <StyledTitleContainer>
        <StyledTitle>{`Paso ${currentStep + 1} de ${steps.length}`}</StyledTitle>
        <StyledPreviousArrowButton
          trailingIcon={<IconArrowRight />}
          disabled={isFirstStep}
          variant='secondary'
          onClick={onPreviousStep}
        />
      </StyledTitleContainer>
      <StyledStepsWrapper>
        <StyledStepsInnerWrapper percentage={percentage}>
          {steps.map((step, index) => (
            <StyledStepButton key={step.id} variant='fifth' onClick={() => setCurrentStep?.(index)} noBackground>
              <StylesStepLabel status={getStatus(index)}>{step.label}</StylesStepLabel>
              {currentStep > index && <StyledCheckIcon />}
            </StyledStepButton>
          ))}
        </StyledStepsInnerWrapper>
        {steps[currentStep].sidebarChildren}
      </StyledStepsWrapper>
    </>
  );
};

export default Steps;
