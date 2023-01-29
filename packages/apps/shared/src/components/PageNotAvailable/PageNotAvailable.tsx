import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { images } from '../../assets';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 428px;
  margin: auto;
  padding: 20px;
  > p {
    text-align: center;
  }
`;

const StyledTitle = styled.h6`
  margin: 36px 0;
  text-align: center;
`;

type Props = {
  title?: string;
  children?: ReactNode;
  noDescription?: boolean;
  className?: string;
};

const PageNotAvailable = ({
  title = '¡Lo sentimos! La página que estás buscando aún no está disponible',
  children,
  noDescription,
  className,
}: Props) => (
  <StyledWrapper className={className}>
    <images.Device />
    <StyledTitle>{title}</StyledTitle>
    {!children && !noDescription ? (
      <>
        <p>Pronto estaremos brindándote nuevo contenido.</p>
        <br />
        <p>¡Gracias por interesarte en Wimet!</p>
      </>
    ) : (
      children
    )}
  </StyledWrapper>
);

export default PageNotAvailable;
