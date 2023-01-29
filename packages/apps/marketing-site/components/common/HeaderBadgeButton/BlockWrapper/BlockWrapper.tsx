import { Label } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Layout } from '../../../mixins';

const StyledWrapper = styled.div`
  ${Layout}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 75px;
  padding-bottom: 75px;
  width: 100%;

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

type Props = {
  overlineText?: string;
  title?: string;
  children: React.ReactNode;
};

export default function BlockWrapper({ overlineText, title, children }: Props) {
  return (
    <StyledWrapper data-aos='fade-up'>
      <StyledLabel text={overlineText} variant='secondary' />
      <StyledTitle>{title}</StyledTitle>
      {children}
    </StyledWrapper>
  );
}
