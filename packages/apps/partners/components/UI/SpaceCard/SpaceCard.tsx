import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { Text, InputSpinner, Checkbox } from '@wimet/apps-shared';

type StyledWrapperProps = {
  checked: boolean;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 10px;
  transition: all 0.1s linear;
  outline: 2px solid transparent;
  position: relative;
  ${({ theme, checked }) =>
    checked &&
    css`
      outline-color: ${theme.colors.blue};
      box-shadow: ${theme.shadows[0]};
    `};
`;

const StyledImageContainer = styled.div`
  height: 160px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const TextBold = styled(Text)`
  font-weight: ${({ theme }) => theme.fontWeight[3]};
`;

const StyledInfoContainer = styled.div`
  padding: 24px 14px 22px;
  height: calc(100% - 160px);
  display: flex;
  flex-direction: column;
`;

const StyledQuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 10px;
  padding-top: 16px;
  margin-top: auto;
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 20px;
`;

type CardProps = {
  title: string;
  description: string;
  image: string;
  quantity?: number;
  value: number;
  onChange: (value: number) => void;
};

const Card: React.FC<CardProps> = ({ title, description, image, quantity = 0, value, onChange }) => {
  const handleCheckboxChange = () => onChange(value > 0 ? 0 : 1);

  return (
    <StyledWrapper checked={value > 0}>
      <StyledCheckbox checked={value > 0} onChange={handleCheckboxChange} />
      <StyledImageContainer>
        <Image src={image} layout='fill' />
      </StyledImageContainer>
      <StyledInfoContainer>
        <TextBold variant='large'>{title}</TextBold>
        <Text>{description}</Text>
        <StyledQuantityContainer>
          <TextBold>Cantidad</TextBold>
          <InputSpinner min={quantity} value={value} onChange={onChange} name='spinner' />
        </StyledQuantityContainer>
      </StyledInfoContainer>
    </StyledWrapper>
  );
};

export default Card;
