import { useFormikContext } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useGetReservations } from '../../../hooks/api/useGetReservations';
import useGetReservationUsers from '../../../hooks/api/useGetReservationUsers';
import { BookingInitialValues } from '../../../pages/spaces/office';
import MembersList from '../../MembersList';
import LiveMap from './LiveMap';

const StyledWrapper = styled.div`
  margin-top: 48px;
`;
const StyledContent = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  height: calc(100vh - 392px);
`;

const realTimeOptions = {
  keepPreviousData: true,
  staleTime: 0,
  refetchInterval: 5000,
};

const LivePageMap = () => {
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<number[]>([]);
  const { values } = useFormikContext<BookingInitialValues>();
  const { selectedDate } = values;
  const { data = [] } = useGetReservations({ selectedDate }, realTimeOptions);
  const { data: users = [] } = useGetReservationUsers({ selectedDate }, realTimeOptions);
  const selectedReservation = useMemo(
    () => data?.find(r => currentSelectedUsers.includes(r.userId)),
    [currentSelectedUsers, data]
  );

  const handleSelectMember = (userId: number) => {
    if (currentSelectedUsers.includes(userId)) {
      setCurrentSelectedUsers(currentSelectedUsers.filter(u => u !== userId));
    } else {
      setCurrentSelectedUsers([...currentSelectedUsers, userId]);
    }
  };

  const handlePopupOpen = useCallback(
    (reservationIds: number[]) => {
      const userIds = data.filter(r => reservationIds.includes(r.id))?.map(r => r.userId) || [];
      setCurrentSelectedUsers(prev => {
        if (userIds.every(u => prev.includes(u))) return prev;
        return userIds;
      });
    },
    [data]
  );

  const handlePopupClose = () => setCurrentSelectedUsers([]);

  return (
    <StyledWrapper>
      <StyledContent>
        <MembersList membersList={users} onSelectMember={handleSelectMember} selectedMembers={currentSelectedUsers} />
        <LiveMap
          selectedReservationId={Number(selectedReservation?.id)}
          onPopupOpen={handlePopupOpen}
          onPopupClose={handlePopupClose}
        />
      </StyledContent>
    </StyledWrapper>
  );
};

export default LivePageMap;
