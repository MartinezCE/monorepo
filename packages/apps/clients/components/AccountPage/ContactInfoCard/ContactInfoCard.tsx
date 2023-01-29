import { Button, Profile } from '@wimet/apps-shared';
import { TinyEdit } from '@wimet/apps-shared/lib/assets/images';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  padding: 33px 24px;
  align-items: center;
`;

const StyledProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const StyledProfileUserText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;
const StyledName = styled.div`
  font-weight: 200;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  margin-bottom: 8px;
`;
const StyledPosition = styled.div`
  font-weight: 200;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.extraSpanishGray};
`;

const StyledButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
`;

type Props = {
  name: string;
  lastname: string;
  position: string;
  image: string;
  onClickEdit?: () => void;
};

const ContactInfoCard = ({ name, position, image, onClickEdit, lastname }: Props) => (
  <StyledWrapper>
    <StyledProfileWrapper>
      <Profile showUserLabel={false} variant='blue' image={image} size='medium' />
      <StyledProfileUserText>
        <StyledName>{`${name} ${lastname}`}</StyledName>
        <StyledPosition>{position}</StyledPosition>
      </StyledProfileUserText>
    </StyledProfileWrapper>
    <StyledButton variant='secondary'>
      <TinyEdit onClick={onClickEdit} />
    </StyledButton>
  </StyledWrapper>
);

export default ContactInfoCard;
