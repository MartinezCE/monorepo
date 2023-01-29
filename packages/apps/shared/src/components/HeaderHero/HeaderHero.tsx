import styled from 'styled-components';
import Image from 'next/image';
import Button from '../Button';

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  padding: 3rem;
  border-radius: 8px;
  justify-content: space-between;
`;

const StyledCardText = styled.div`
  > h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 39px;
  }
  > p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin: 2em 0;
  }
`;

const StyledCardImageContent = styled.div`
  width: 440px;
`;

const StyledImage = styled(Image)`
  object-fit: contain;
  object-position: right;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  width: 440px;
`;

const HeaderHero = ({ title, description, banner, handleClick }) => (
  <StyledCard>
    <StyledCardText>
      <h1>{title}</h1>
      <p>{description}</p>
      <Button variant='primary' onClick={handleClick}>
        Comenzar
      </Button>
    </StyledCardText>
    <StyledCardImageContent>
      <StyledImage src={banner} />
    </StyledCardImageContent>
  </StyledCard>
);
export default HeaderHero;
