import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  PlacesDropdown,
  Select,
  spaceReservationDescription,
  spaceReservationLabels,
  SpaceTypeEnum,
  spaceTypeFilterLabels,
  useGetReservationType,
  useGetSpaceType,
  images,
} from '@wimet/apps-shared';
import { isArray } from 'lodash';
import { useField } from 'formik';
import HeaderBadgeButton from '../common/HeaderBadgeButton';

const StyledWrapper = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    display: block;
  }
`;

const StyledFilterSelect = styled(Select)<{ open: boolean }>`
  width: 111px;
  flex-shrink: 0;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${({ open }) =>
      open &&
      css`
        display: none;
      `}
  }
`;

const StyledBadgeRow = styled.div`
  display: flex;
  column-gap: 16px;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    //justify-content: center;
  }
`;

const StyledSearchIcon = styled(images.Search)`
  padding: 14px 0 14px 24px;
  box-sizing: content-box;
  flex-shrink: 0;
`;

const StyledMobileRow = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
  }
`;

const StyledPlacesDropdown = styled(PlacesDropdown)<{ open: boolean }>`
  display: none;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    transition: width 0.2s ease-in-out;
    ${({ open }) =>
      open
        ? css`
            height: 40px;
            width: 290px;
            > div {
              > svg {
                padding: 8px 0 8px 12px;
              }
            }
          `
        : css`
            width: 60px;
            > div {
              border: none;
              background: none;
              > input {
                background: none;
              }
              > svg {
                margin: auto;
              }
            }
          `}
  }
`;

const StyledCloseSearch = styled(images.ChevronLeft)<{ open: boolean }>`
  display: none;
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${({ open }) =>
      open &&
      css`
        display: flex;
      `}
  }
`;

const CommonFilterSpaceHeader = ({ children, map }: { children?: React.ReactNode; map?: google.maps.Map }) => {
  const [spaceReservationTypeId, ,] = useField('spaceReservationTypeId');
  const [open, setOpen] = useState(false);
  const { data = [] } = useGetSpaceType(spaceReservationTypeId.value, {
    enabled: !!spaceReservationTypeId.value,
  });
  const { data: reservationOptions = [] } = useGetReservationType({
    select: _data =>
      _data.map(({ id, value }) => ({
        value: id,
        label: spaceReservationLabels[value as keyof typeof spaceReservationLabels],
        description: spaceReservationDescription[value as keyof typeof spaceReservationDescription],
      })),
  });
  const [spaceTypeId, , spaceTypeIdHelpers] = useField('spaceTypeId');

  const handleToggleSpaceTypeFilter = (spaceType: { id: string; value: string }) => {
    if (isArray(spaceTypeId.value)) {
      if (spaceTypeId.value.includes(spaceType.id)) {
        spaceTypeIdHelpers.setValue(spaceTypeId.value.filter((id: number) => id !== Number(spaceType.id)));
      } else {
        spaceTypeIdHelpers.setValue([...spaceTypeId.value, spaceType.id]);
      }
    } else if (spaceTypeId.value === spaceType.id) {
      spaceTypeIdHelpers.setValue(undefined);
    } else {
      spaceTypeIdHelpers.setValue(spaceType.id);
    }
  };

  const handleIsActive = useCallback(
    spaceType => {
      if (isArray(spaceTypeId.value)) {
        return spaceTypeId.value.includes(spaceType.id);
      }
      return spaceTypeId.value === spaceType.id;
    },
    [spaceTypeId.value]
  );

  return (
    <StyledWrapper>
      <StyledMobileRow>
        <StyledFilterSelect
          variant='tertiary'
          options={reservationOptions}
          instanceId='bookingOptions'
          name='spaceReservationTypeId'
          open={open}
        />
        <StyledCloseSearch open={open} onClick={() => setOpen(false)} />
        {map && (
          <StyledPlacesDropdown
            placeholder='Buscar por nombre de espacio'
            name='searchValue'
            leadingAdornment={<StyledSearchIcon />}
            map={map}
            open={open}
            onClick={() => setOpen(true)}
          />
        )}
      </StyledMobileRow>
      <StyledBadgeRow>
        {data.map((spaceType: { id: string; value: SpaceTypeEnum }) => (
          <HeaderBadgeButton
            key={spaceType.id}
            onClick={() => handleToggleSpaceTypeFilter(spaceType)}
            text={spaceTypeFilterLabels[spaceType.value]}
            isActive={handleIsActive(spaceType)}
          />
        ))}
      </StyledBadgeRow>
      {children}
    </StyledWrapper>
  );
};

export default CommonFilterSpaceHeader;
