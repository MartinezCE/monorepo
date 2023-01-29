import { HTMLAttributeAnchorTarget } from 'react';
import styled from 'styled-components';
import { Layout } from '../../mixins';
import Label from '../../UI/Label';
import Link from '../../UI/Link';
import Text from '../../UI/Text';

type StyledWrapperProps = {
  rtl?: boolean;
  firstItem?: boolean;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  ${Layout}
  padding-top: ${({ firstItem }) => (firstItem ? '150px' : '75px')};
  padding-bottom: 75px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: ${({ rtl }) => (rtl ? 'row-reverse' : 'row')};
`;

type StyledLeftSideProps = {
  rtl?: boolean;
};

const StyledLeftSide = styled.div<StyledLeftSideProps>`
  max-width: 530px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const StyledLabel = styled(Label)`
  margin-bottom: 16px;
`;

const StyledTitle = styled.h4`
  margin-bottom: 24px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes[5]};
    line-height: ${({ theme }) => theme.lineHeights[3]};
  }
`;

const StyledDescription = styled(Text)`
  max-width: 490px;
  margin-bottom: 32px;
`;

const StyledRightSide = styled.div`
  width: fit-content;
`;

type Props = {
  id: string;
  label: string;
  title: string;
  description: string;
  buttonText?: string;
  rtl?: boolean;
  children?: React.ReactNode;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  firstItem?: boolean;
};

export default function ImageListSlide({
  id,
  label,
  title,
  description,
  buttonText,
  rtl,
  children,
  href,
  target,
  firstItem,
}: Props) {
  return (
    <StyledWrapper id={id} rtl={rtl} firstItem={firstItem} data-aos={`fade-${rtl ? 'right' : 'left'}`}>
      <StyledLeftSide rtl={rtl}>
        <StyledLabel text={label} size='small' />
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
        <Link variant='outline' href={href} target={target}>
          {buttonText}
        </Link>
      </StyledLeftSide>
      <StyledRightSide>{children}</StyledRightSide>
    </StyledWrapper>
  );
}
