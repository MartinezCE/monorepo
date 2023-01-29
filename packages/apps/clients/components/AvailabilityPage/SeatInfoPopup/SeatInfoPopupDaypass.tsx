import styled from 'styled-components';
import { WPMReservationTypeLabels, Label, WPMReservationTypes, WPMReservation, useGetMe } from '@wimet/apps-shared';
import { useEffect, useState } from 'react';
import SeatInfoPopupContainer from './SeatInfoPopupContainer';
import SeatInfoPopupAvatarRow from './SeatInfoPopupAvatarRow';
import { useGetCompanyUsers } from '../../../hooks/api/useGetCompanyUsers';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledInnerContentWrapper = styled(StyledColumn)`
  row-gap: 8px;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

type Props = {
  className?: string;
  reservation?: WPMReservation;
};

const SeatInfoPopupDaypass = ({ className, reservation }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { data: userData } = useGetMe();
  const { data: users = [] } = useGetCompanyUsers(Number(userData?.companies?.[0]?.id));
  const user = users.filter(e => e.id === reservation?.userId);
  useEffect(() => {
    user.map(async e => setFirstName(e.firstName));
    user.map(async e => setLastName(e.lastName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { avatarUrl } = reservation?.user || {};
  const reservationType = reservation?.WPMReservationType?.name as keyof typeof WPMReservationTypes;

  return (
    <SeatInfoPopupContainer className={className}>
      <StyledInnerContentWrapper>
        <SeatInfoPopupAvatarRow avatarUrl={avatarUrl} firstName={firstName} lastName={lastName} />

        <StyledLabel text={WPMReservationTypeLabels[reservationType]} variant='currentColor' size='small' lowercase />
      </StyledInnerContentWrapper>
    </SeatInfoPopupContainer>
  );
};

export default SeatInfoPopupDaypass;
