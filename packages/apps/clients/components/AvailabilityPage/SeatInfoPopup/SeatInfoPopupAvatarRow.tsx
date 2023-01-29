import { Label, Text, Profile } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledRow = styled.div`
  display: flex;
  column-gap: 16px;
  align-items: center;
`;

const StyledText = styled(Text)`
  font-weight: ${({ theme }) => theme.fontWeight[2]};
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledProfile = styled(Profile)`
  justify-content: center;
  align-items: center;
  cursor: auto;

  > div > div {
    width: 34px;
    height: 34px;
  }
`;

type Props = {
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
};

const SeatInfoPopupAvatarRow = ({ avatarUrl, firstName, lastName }: Props) => (
  <StyledRow>
    <StyledProfile
      showUserLabel={false}
      variant={avatarUrl ? 'transparent' : 'gray'}
      borderWidth={1}
      size='medium'
      image={avatarUrl}
    />
    <StyledColumn>
      <StyledLabel text='Ocupado por' variant='currentColor' lowercase />
      <StyledText>
        {firstName} {lastName}
      </StyledText>
    </StyledColumn>
  </StyledRow>
);

export default SeatInfoPopupAvatarRow;
