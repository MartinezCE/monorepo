import Image from 'next/image';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledImageWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
`;

const StyledName = styled.span`
  font-size: 18px; // TODO - Move to theme
  line-height: ${({ theme }) => theme.lineHeights[3]};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
`;

type AvatarProps = {
  name?: string;
  picture?: string;
};

const Avatar: React.FC<AvatarProps> = ({ name, picture }) => (
  <StyledWrapper>
    {picture && (
      <StyledImageWrapper>
        <Image src={picture} layout='fill' alt={name} />
      </StyledImageWrapper>
    )}
    <StyledName>{name}</StyledName>
  </StyledWrapper>
);

export default Avatar;
