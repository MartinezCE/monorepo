/* eslint-disable no-return-assign */
import { SpaceReservationType, Space } from '@wimet/apps-shared';
import { ForwardedRef, forwardRef, MutableRefObject } from 'react';
import SpaceDetailsSection from '../SpaceDetailsSection';
import SpaceDetailsCreditsHourlySection from './SpaceDetailsCreditsHourlySection';
import SpaceDetailsCreditsMonthlySection from './SpaceDetailsCreditsMonthlySection';

type Props = {
  space: Partial<Space>;
};

function SpaceDetailsCreditsSection({ space }: Props, ref: ForwardedRef<(HTMLElement | HTMLElement[] | null)[]>) {
  const { current } = ref as MutableRefObject<(HTMLElement | HTMLElement[] | null)[]>;

  return (
    <>
      {space?.spaceReservationType?.value === SpaceReservationType.HOURLY && (
        <SpaceDetailsSection ref={_ref => (current[3] = _ref)} title='Créditos' titleSuffix='(por persona)'>
          <SpaceDetailsCreditsHourlySection credits={space.hourly} />
        </SpaceDetailsSection>
      )}
      {space?.spaceReservationType?.value === SpaceReservationType.MONTHLY && (
        <SpaceDetailsSection ref={_ref => (current[3] = _ref)} title='Precios'>
          <SpaceDetailsCreditsMonthlySection prices={space.monthly} />
        </SpaceDetailsSection>
      )}
    </>
  );
}

export default forwardRef(SpaceDetailsCreditsSection);
