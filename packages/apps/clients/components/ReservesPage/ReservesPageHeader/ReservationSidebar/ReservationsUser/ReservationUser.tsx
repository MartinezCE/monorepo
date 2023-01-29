import { Avatar } from '@wimet/apps-shared';
import styled from 'styled-components';

const ReservationUserContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ReservationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:last-child {
    margin-left: 1em;
    display: flex;
    flex-direction: column;
    > span:first-child {
      font-weight: 300;
      font-size: 12px;
      line-height: 16px;
    }
    > span:last-child {
      font-weight: 700;
      font-size: 12px;
      line-height: 16px;
      text-align: left;
    }
  }
`;
const ReservationHours = styled.div`
  display: flex;
  align-items: center;
  > span:first-child {
    font-weight: 300;
    font-size: 12px;
    line-height: 16px;
  }
`;

type Props = {
  avatarUrl?: string;
  fullName: string;
  from: string;
  to: string;
};

export default function ReservationUser({ avatarUrl, fullName, from, to }: Props) {
  const variant = 'transparent';

  return (
    <ReservationUserContainer>
      <ReservationInfo>
        <Avatar image={avatarUrl} variant={variant} />
        <div>
          <span>Reservado por</span>
          <span>{fullName}</span>
        </div>
      </ReservationInfo>
      <ReservationHours>
        <span>
          Desde {from} hasta {to} hs.
        </span>
      </ReservationHours>
    </ReservationUserContainer>
  );
}
