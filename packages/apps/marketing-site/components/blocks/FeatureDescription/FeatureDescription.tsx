import Image from 'next/image';
import styled from 'styled-components';
import { Layout } from '../../mixins';
import Label from '../../UI/Label';
import Text from '../../UI/Text';
import { BlockFeatureDescription } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled.div`
  ${Layout}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 75px;
  padding-bottom: 75px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 56px;
    padding-bottom: 56px;
  }
`;

const StyledLabel = styled(Label)`
  margin-bottom: 10px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 8px;
  }
`;

const StyledTitle = styled.h4`
  text-align: center;
  margin-bottom: 60px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 40px;
  }
`;

const StyledRow = styled.div`
  width: 100%;
  display: flex;
  gap: 90px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 30px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 60px;
  }
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledTextWrapper = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledItemTitle = styled.h6`
  text-align: center;
  margin-top: 34px;
  margin-bottom: 8px;
`;

const StyledItemDescription = styled(Text)`
  max-width: 270px;
  text-align: center;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 300px;
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  width: 270px;
  height: 154px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: 100px;
  }
`;

type Props = BlockFeatureDescription;

export default function FeatureDescription({ features, overlineText, title }: Props) {
  return (
    <StyledWrapper data-aos='fade-up'>
      <StyledLabel text={overlineText} variant='secondary' />
      <StyledTitle>{title}</StyledTitle>
      <StyledRow>
        {features?.map(({ description, image, title: featureTitle, id, imageFullWidth }) => (
          <StyledItem key={id}>
            <StyledImageContainer>
              <Image
                {...getImageProps(image, 'fill')}
                objectFit={imageFullWidth ? 'cover' : 'contain'}
                objectPosition='center'
              />
            </StyledImageContainer>
            <StyledTextWrapper>
              <StyledItemTitle>{featureTitle}</StyledItemTitle>
              <StyledItemDescription>{description}</StyledItemDescription>
            </StyledTextWrapper>
          </StyledItem>
        ))}
      </StyledRow>
    </StyledWrapper>
  );
}
