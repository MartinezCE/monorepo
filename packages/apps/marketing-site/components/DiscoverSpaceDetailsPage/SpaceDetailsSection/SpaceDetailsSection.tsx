import { forwardRef } from 'react';
import { Text } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledWrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const StyledLayoutWrapper = styled.div`
  width: 100%;
  max-width: 100%;
`;

const StyledInnerWrapper = styled.div`
  max-width: 737px;
`;

const StyledTitle = styled.h6`
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  display: inline-block;
  font-size: 20px;

  > b {
    font-weight: ${({ theme }) => theme.fontWeight[2]};
  }
`;

const StyledDescription = styled(Text)`
  margin-top: 8px;
`;

type Props = {
  title?: string;
  titleSuffix?: string;
  description?: string;
  children?: React.ReactNode;
  keepTitleInLayout?: boolean;
  keepDescriptionInLayout?: boolean;
  keepChildrenInLayout?: boolean;
  className?: string;
};

const SpaceDetailsSection = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const {
    title,
    titleSuffix,
    description,
    children,
    keepTitleInLayout = true,
    keepDescriptionInLayout = true,
    keepChildrenInLayout = true,
    className,
  } = props;

  const Title = (
    <StyledTitle>
      <b>{title}</b> {titleSuffix}
    </StyledTitle>
  );

  const Description = <StyledDescription variant='large'>{description}</StyledDescription>;

  return (
    <StyledWrapper ref={ref} className={className}>
      {(keepTitleInLayout || keepDescriptionInLayout || keepChildrenInLayout) && (
        <StyledLayoutWrapper>
          <StyledInnerWrapper>
            {keepTitleInLayout && title && Title}
            {keepDescriptionInLayout && description && Description}
            {keepChildrenInLayout && children}
          </StyledInnerWrapper>
        </StyledLayoutWrapper>
      )}
      {!keepTitleInLayout && title && Title}
      {!keepDescriptionInLayout && description && Description}
      {!keepChildrenInLayout && children}
    </StyledWrapper>
  );
});

export default SpaceDetailsSection;
