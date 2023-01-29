import React from 'react';
import styled from 'styled-components';
import { BlockInfo, getSpaceTypeDescription, getSpaceTypeLabel, useGetAllSpacesTypes } from '@wimet/apps-shared';
import SpaceCard from '../../UI/SpaceCard';

const StyledSpacesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 46px;
  margin-bottom: 24px;
  > div {
    width: 240px;
  }
`;

const StyledBlockInfo = styled(BlockInfo)`
  max-width: 240px;
`;

const spaceImg = {
  SHARED: '/space_1.jpg',
  MEETING_ROOM: '/images/meet_space.png',
  PRIVATE_OFFICE: '/images/private_office.png',
};

type SelectSpaceTypeSectionProps = {
  spacesSelected?: { spaceTypeId: number; count: number }[];
  onChange: ({ id, value, name }: { id: number; value: number; name: string }) => void;
};

const SelectSpaceTypeSection: React.FC<SelectSpaceTypeSectionProps> = ({ spacesSelected, onChange }) => {
  const { data } = useGetAllSpacesTypes();
  const getCurrentValue = (spaceTypeId: number) =>
    spacesSelected?.find(item => item.spaceTypeId === spaceTypeId)?.count;

  return (
    <div>
      <StyledSpacesContainer>
        {(data || []).map(space => (
          <React.Fragment key={space.id}>
            <SpaceCard
              title={getSpaceTypeLabel(space.value)}
              description={getSpaceTypeDescription(space.value)}
              image={spaceImg[space.value]}
              value={getCurrentValue(space.id) || 0}
              onChange={value => onChange({ id: space.id, value, name: getSpaceTypeLabel(space.value) })}
            />
          </React.Fragment>
        ))}
      </StyledSpacesContainer>
      <StyledBlockInfo>La cantidad hace referencia a las áreas disponibles.</StyledBlockInfo>
    </div>
  );
};

export default SelectSpaceTypeSection;
