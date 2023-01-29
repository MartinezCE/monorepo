import React, { useState } from 'react';
import { Button, images, Label } from '@wimet/apps-shared';
import styled from 'styled-components';

type StyledTinyChevronDownProps = {
  $isOpen: boolean;
};
const StyledTinyChevronDown = styled(images.TinyChevronDown)<StyledTinyChevronDownProps>`
  color: ${({ theme }) => theme.colors.blue};
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const StyledLabel = styled(Label)`
  font-size: 14px;
`;

type Props = {
  onToogle: (value: boolean) => void;
};

const MoreInfoButton = ({ onToogle }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClickMore = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onToogle(!isOpen);
  };

  return (
    <Button variant='transparent' onClick={handleOnClickMore}>
      <StyledLabel text='Más info' lowercase size='small' variant='tertiary' />
      <StyledTinyChevronDown $isOpen={isOpen} />
    </Button>
  );
};

export default MoreInfoButton;
