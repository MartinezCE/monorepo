import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';
import useGetBlueprintReservationUsers from '../../../hooks/api/useGetBlueprintReservationUsers';
import { useGetSeats } from '../../../hooks/api/useGetSeats';
import { BookingInitialValues } from '../../../pages/spaces/office';
import MembersList from '../../MembersList';
import { BlueprintArea } from '../../ReservesPage';
import useFilterOptions from '../../WorkplaceManagerPage/SelectSeatsSection/useFilterOptions';
import LivePageForm from './LivePageForm';

const StyledWrapper = styled.div`
  margin-top: 48px;
`;
const StyledContent = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
`;

const realTimeOptions = { keepPreviousData: true, staleTime: 0, refetchInterval: 5000 };

const LivePageLocation = () => {
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<number[]>([]);
  const { values } = useFormikContext<BookingInitialValues>();
  const { selectedDate } = values;
  const filters = useFilterOptions({ fetchAllLocations: true, fetchOnlyPublished: true });
  const { data } = useGetSeats(
    filters?.currentBlueprint?.id,
    { includeReservations: true, selectedDate },
    realTimeOptions
  );
  const { data: users = [] } = useGetBlueprintReservationUsers(
    filters?.currentBlueprint?.id,
    { selectedDate },
    realTimeOptions
  );
  const selectedSeat = data?.find(s => s.WPMReservations?.some(r => currentSelectedUsers.includes(r.userId)));

  const handleSelectMember = (userId: number) => {
    if (currentSelectedUsers.includes(userId)) {
      setCurrentSelectedUsers(currentSelectedUsers.filter(u => u !== userId));
    } else {
      setCurrentSelectedUsers([...currentSelectedUsers, userId]);
    }
  };

  const handlePopupOpen = (seatId: number) => {
    const userIds = data?.find(s => s.id === seatId)?.WPMReservations?.map(r => r.userId) || [];
    setCurrentSelectedUsers(userIds);
  };

  const handlePopupClose = () => setCurrentSelectedUsers([]);

  return (
    <StyledWrapper>
      <LivePageForm {...filters} />
      <StyledContent>
        <MembersList membersList={users} onSelectMember={handleSelectMember} selectedMembers={currentSelectedUsers} />
        <BlueprintArea
          blueprint={filters.currentBlueprint}
          floorNumber={filters.currentFloor?.number}
          isReservable={false}
          selectedSeatId={selectedSeat?.id}
          onPopupOpen={handlePopupOpen}
          onPopupClose={handlePopupClose}
        />
      </StyledContent>
    </StyledWrapper>
  );
};

export default LivePageLocation;
