import React from 'react';
import { BaseHeader, Space } from '@wimet/apps-shared';
import styled from 'styled-components';
import CreditsInfoBadge from '../../CreditsInfoBadge';

type StyledWrapperProps = {
  show: boolean;
};

const StyledWrapper = styled(BaseHeader)<StyledWrapperProps>`
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  display: flex;
  align-items: center;
  border-radius: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const StyledSpaceStickyHeaderLeftArea = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSpaceStickyHeaderMainText = styled.div`
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 20px;
  font-weight: 500;
`;
const StyledSpaceStickyHeaderItems = styled.div`
  display: flex;
  margin-left: 32px;
  &::last-child {
    margin-right: 0;
  }
`;

type StyledSpaceStickyHeaderItemProps = {
  isActive?: boolean;
};

const StyledSpaceStickyHeaderItem = styled.div<StyledSpaceStickyHeaderItemProps>`
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? 500 : 200)};
  margin-right: 24px;
`;
const StyledSpaceStickyHeaderCredits = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
  font-weight: 200;
`;

const SECTIONS = [
  { id: 0, title: 'Imágen' },
  { id: 1, title: 'El lugar' },
  { id: 2, title: 'Disponibilidad & Amenities' },
  { id: 3, title: 'Créditos' },
  { id: 4, title: 'Cómo llegar' },
  { id: 5, title: 'Seguridad & Higiene' },
  { id: 6, title: 'Documentos' },
];

type Props = {
  activeSectionId: number | null;
  show: boolean;
  onClickItem: (id: number) => void;
  space: Partial<Space>;
};

const SpaceDetailsStickyHeader = ({ activeSectionId, show, onClickItem, space }: Props) => (
  <StyledWrapper show={show}>
    <StyledSpaceStickyHeaderLeftArea>
      <StyledSpaceStickyHeaderMainText>{space.name}</StyledSpaceStickyHeaderMainText>
      <StyledSpaceStickyHeaderItems>
        {SECTIONS.map(section => (
          <StyledSpaceStickyHeaderItem
            key={section.id}
            onClick={() => onClickItem(section.id)}
            isActive={activeSectionId === section.id}>
            {section.title}
          </StyledSpaceStickyHeaderItem>
        ))}
      </StyledSpaceStickyHeaderItems>
    </StyledSpaceStickyHeaderLeftArea>

    <StyledSpaceStickyHeaderCredits>
      <CreditsInfoBadge space={space} />
    </StyledSpaceStickyHeaderCredits>
  </StyledWrapper>
);

export default SpaceDetailsStickyHeader;
