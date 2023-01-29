import { useMemo, useState, Dispatch, SetStateAction } from 'react';
import { SpaceReservationType, Space, Button, images, useGetMe } from '@wimet/apps-shared';
import { getDay } from 'date-fns';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import SpaceDetailsMonthlyCalendar from './SpaceDetailsMonthlyCalendar';
import SpaceDetailsOnDemandCalendar from './SpaceDetailsOnDemandCalendar';
import ReservationMessageModal from '../../ReservationMessageModal';

const StyledWrapper = styled.div<{ open: boolean }>`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ open }) => (open ? 'flex' : 'none')};
    flex-direction: column;
    > div {
      margin-top: 0;
      overflow-y: initial;
      width: 100%;
      box-shadow: none;
      padding-top: 10px;
    }
  }
`;

const StyledClose = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: flex-end;
    color: ${({ theme: { colors } }) => colors.darkGray};
    background-color: ${({ theme: { colors } }) => colors.white};
    > button {
      width: 20px;
      margin-right: 10px;
    }
  }
`;

const StyledIcon = styled(images.Checkmark)`
  transform: scale(0.9);
  color: ${({ theme }) => theme.colors.success};
`;

export default function SpaceDetailsCalendar({
  space,
  isOpen,
  setIsOpen,
}: {
  space: Partial<Space>;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { data: userData } = useGetMe();
  const router = useRouter();

  const excludeZonedDate = (date: Date, destinationTz: string) => {
    const destinationNow = utcToZonedTime(new Date(), destinationTz);
    const destinationDate = zonedTimeToUtc(date, destinationTz);

    return destinationNow.getTime() > destinationDate.getTime();
  };

  const handleHourlyExcludedDates = (date: Date) => {
    const destinationTz = space.location?.company.tz || 'UTC';
    const day = getDay(date);

    const daysToExclude = [0, 1, 2, 3, 4, 5, 6].filter(d => {
      const hourly = space.hourly?.find(dh => dh.dayOfWeek === d);
      const { closeTime } = space.schedule?.find(s => s.dayOfWeek === d) || {};
      const { dayCreditsWithFee, halfDayCreditsWithFee, fullDayCreditsWithFee } = hourly || {};
      const spaceHasCredits = dayCreditsWithFee || halfDayCreditsWithFee || fullDayCreditsWithFee;

      date.setHours(...((closeTime?.split(':').map(Number) || [0, 0]) as [number, number]));
      const isClosed = excludeZonedDate(date, destinationTz);

      return !spaceHasCredits || isClosed;
    });
    return !daysToExclude.includes(day === 0 ? 6 : day - 1);
  };

  const handleMonthExcludedDates = (date: Date) => {
    const day = getDay(date);
    const daysToExclude = [0, 1, 2, 3, 4, 5, 6].filter(d => !space.schedule?.some(s => s.dayOfWeek === d));
    return !daysToExclude.includes(day === 0 ? 6 : day - 1);
  };

  const monthlyDiscounts = useMemo(
    () =>
      space.monthly?.spaceDiscounts.map(item => ({
        [item.monthsAmount]: Number(item.spaceDiscountMonthlySpace.percentage) * 100,
      })),
    [space.monthly?.spaceDiscounts]
  );

  return (
    <StyledWrapper open={isOpen || false}>
      <StyledClose>
        <Button
          leadingIcon={<images.Close />}
          variant='transparent'
          onClick={() => (setIsOpen ? setIsOpen(false) : () => {})}
        />
      </StyledClose>
      {space?.spaceReservationType?.value === SpaceReservationType.MONTHLY && (
        <SpaceDetailsMonthlyCalendar
          space={space}
          filterDate={handleMonthExcludedDates}
          maxMonthsAmount={space.monthly?.maxMonthsAmount || 1}
          minMonthsAmount={space.monthly?.minMonthsAmount || 1}
          discounts={monthlyDiscounts}
          onConfirmReservation={() => setShowConfirmationModal(true)}
        />
      )}
      {space?.spaceReservationType?.value === SpaceReservationType.HOURLY && (
        <SpaceDetailsOnDemandCalendar
          space={space}
          filterDate={handleHourlyExcludedDates}
          onConfirmReservation={() => setShowConfirmationModal(true)}
        />
      )}
      {showConfirmationModal && (
        <ReservationMessageModal
          title={
            <div>
              <div>¡Listo!</div>
              <div>La reserva ya está confirmada.</div>
            </div>
          }
          onClickClose={() => setShowConfirmationModal(false)}
          onAccept={() => router.push(String(userData?.profileUrl))}
          onAcceptText='Ir al dashboard'
          icon={<StyledIcon />}
        />
      )}
    </StyledWrapper>
  );
}
