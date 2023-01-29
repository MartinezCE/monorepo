import styled from 'styled-components';
import { Link } from '@wimet/apps-shared';
import { Layout } from '../../mixins';
import config from '../../../config';
import { BlockPreFooter } from '../../../interfaces/api';

const StyledOuterWrapper = styled.div`
  padding-top: 75px;
`;

const StyledWrapper = styled.div`
  position: relative;
  height: 600px;
`;

const StyledInnerWrapper = styled.div`
  ${Layout}
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

type StyledImgProps = {
  image: string | null;
};

const StyledImg = styled.div<StyledImgProps>`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 40%;
  background-image: ${({ image }) => `url(${image})`};
  background-position: center;
  background-size: cover;
`;

const StyledOverlay = styled.div`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.blue};
  opacity: 100%;
  mix-blend-mode: multiply;
`;

const StyledTitle = styled.h4`
  max-width: 700px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 40px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.fontSizes[7]};
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes[6]};
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes[5]};
  }
`;

const StyledText = styled.p`
  max-width: 500px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 400;
  line-height: ${({ theme }) => theme.lineHeights[1]};
`;

const StyledLink = styled(Link)`
  margin-top: 70px;
`;

type Props = BlockPreFooter;

export default function Prefooter({ image, button, description, title }: Props) {
  return (
    <StyledOuterWrapper>
      <StyledWrapper>
        <StyledImg image={image?.data ? `${config.STRAPI_ASSETS_BASE_URL}${image?.data?.attributes?.url}` : null} />
        <StyledOverlay />
        <StyledInnerWrapper data-aos='fade-up'>
          <StyledTitle>{title}</StyledTitle>
          <StyledText>{description}</StyledText>
          <StyledLink variant='fourth' href={button?.link} target={button?.openNewTab ? '_blank' : '_self'}>
            {button?.text}
          </StyledLink>
        </StyledInnerWrapper>
      </StyledWrapper>
    </StyledOuterWrapper>
  );
}
