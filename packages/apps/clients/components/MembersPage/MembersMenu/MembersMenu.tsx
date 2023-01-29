import { Button, images, Text } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  display: flex;
  column-gap: 26px;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
`;

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const StyledWorkplaceIcon = styled(images.Briefcase)`
  color: ${({ theme }) => theme.colors.blue};
  flex-shrink: 0;
`;

const StyledStarIcon = styled(images.Search)`
  color: ${({ theme }) => theme.colors.blue};
  flex-shrink: 0;
`;

const StyledText = styled(Text)`
  text-align: left;
`;

type Props = {
  onOptionClick: (option: string) => void;
};

const MembersMenu = ({ onOptionClick }: Props) => {
  const router = useRouter();
  return (
    <StyledWrapper>
      <StyledInnerWrapper>
        <StyledButton variant='secondary' onClick={() => onOptionClick('reservation')}>
          <StyledWorkplaceIcon />
          <StyledColumn>
            <StyledText>
              <b>Mis oficinas</b>
            </StyledText>
            <StyledText>
              Visualiza los espacios disponibles de tu oficina y selecciona la fecha y el período en el que quieras
              reservar.
            </StyledText>
          </StyledColumn>
        </StyledButton>
        <StyledButton
          variant='secondary'
          onClick={() => router.replace(`${process.env.NEXT_PUBLIC_INDEX_URL}/discover`)}>
          <StyledStarIcon />
          <StyledColumn>
            <StyledText>
              <b>Explorar workspaces</b>
            </StyledText>
            <StyledText>
              Descubre y reserva en +500 espacios ideales para ti, cerca de tu casa, o desde donde quieras trabajar.
            </StyledText>
          </StyledColumn>
        </StyledButton>
      </StyledInnerWrapper>
    </StyledWrapper>
  );
};

export default MembersMenu;
