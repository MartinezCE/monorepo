/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { SpaceReservationType, Space } from '@wimet/apps-shared';
import { forwardRef, ForwardedRef, MutableRefObject, useMemo } from 'react';
import styled from 'styled-components';
import { groupAmenitiesFromSpace } from '../../../utils/amenity';
import SpaceDetailsSection from '../SpaceDetailsSection';
import SpaceDetailsAmenitiesSection from './SpaceDetailsAmenitiesSection';
import SpaceDetailsDisponibilityHourlySection from './SpaceDetailsDisponibilityHourlySection';
import SpaceDetailsDisponibilityMonthlySection from './SpaceDetailsDisponibilityMonthlySection';

const StyledRowWrapper = styled(SpaceDetailsSection)`
  > div > div {
    display: flex;
    column-gap: 137px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      flex-wrap: wrap;
      row-gap: 50px;
    }

    section {
      width: 100%;
    }
  }
`;

const StyledSpaceDetailsAmenitiesSection = styled(SpaceDetailsAmenitiesSection)`
  row-gap: 40px;
  min-width: 318px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: auto;
  }
`;

type Props = {
  space: Partial<Space>;
};

function SpaceDetailsDisponibilityAmenitiesSection(
  { space }: Props,
  ref: ForwardedRef<(HTMLElement | HTMLElement[] | null)[]>
) {
  const amenities = useMemo(
    () => groupAmenitiesFromSpace(space),
    [space.location?.locationsAmenities, space.spacesAmenities] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { current } = ref as MutableRefObject<(HTMLElement | HTMLElement[] | null)[]>;

  return (
    <>
      {space?.spaceReservationType?.value === SpaceReservationType.MONTHLY && (
        <StyledRowWrapper ref={_ref => (current[2] = _ref)}>
          <SpaceDetailsSection
            title='Disponibilidad'
            keepTitleInLayout={false}
            keepDescriptionInLayout={false}
            keepChildrenInLayout={false}>
            <SpaceDetailsDisponibilityMonthlySection schedule={space.schedule} />
          </SpaceDetailsSection>
          <SpaceDetailsSection
            title='Amenities'
            keepTitleInLayout={false}
            keepDescriptionInLayout={false}
            keepChildrenInLayout={false}>
            <StyledSpaceDetailsAmenitiesSection amenities={amenities} maxAmenities={6} />
          </SpaceDetailsSection>
        </StyledRowWrapper>
      )}
      {space?.spaceReservationType?.value === SpaceReservationType.HOURLY && (
        <>
          <SpaceDetailsSection
            title='Amenities'
            ref={_ref => {
              if (!_ref) return;
              current[2] = [_ref];
            }}>
            <SpaceDetailsAmenitiesSection amenities={amenities} />
          </SpaceDetailsSection>
          <SpaceDetailsSection
            title='Disponibilidad'
            ref={_ref => {
              if (!_ref || !current[2]) return;
              current[2] = [...[current[2]].flat(), _ref];
            }}>
            <SpaceDetailsDisponibilityHourlySection schedule={space.schedule} />
          </SpaceDetailsSection>
        </>
      )}
    </>
  );
}

export default forwardRef(SpaceDetailsDisponibilityAmenitiesSection);
