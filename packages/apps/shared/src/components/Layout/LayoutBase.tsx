import { ReactNode } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { mixins, GlobalStyle } from '../../common';

const StyledWrapperContent = styled.div`
  ${mixins.Layout}
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.extraLightGray};
  overflow: auto;
`;

type Props = {
  title?: string;
  children?: ReactNode;
  className?: string;
  customHeader?: ReactNode;
};

export default function LayoutBase({ title = 'Next Template', children, className, customHeader }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <GlobalStyle />
      {customHeader}
      <StyledWrapperContent className={className}>{children}</StyledWrapperContent>
    </>
  );
}
