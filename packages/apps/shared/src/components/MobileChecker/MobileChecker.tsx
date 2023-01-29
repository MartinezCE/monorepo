import styled from 'styled-components';
import { Logo } from '../../assets/images';
import { useMediaQuery } from '../../hooks';
import LayoutBase from '../Layout/LayoutBase';
import Link from '../Link';

const StyledWrapper = styled.div`
  width: fit-content;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  row-gap: 10px;
`;

const StyledLogo = styled(Logo)`
  width: 160px;
  margin-bottom: 40px;
`;

const StyledTitle = styled.h4`
  font-size: 28px;
  line-height: 34px;
`;

const StyledText = styled.p`
  font-size: 20px;
  line-height: 26px;
`;

const StyledLink = styled(Link)`
  width: fit-content;
  font-size: 16px;
  line-height: 22px;
`;

type Props = {
  children: React.ReactNode;
  ignoreBreakpoint?: boolean;
};

export default function MobileChecker({ children, ignoreBreakpoint = false }: Props) {
  const isBreakpoint = useMediaQuery({ width: 992 });

  return (
    <>
      {isBreakpoint && !ignoreBreakpoint ? (
        <LayoutBase title='Wimet'>
          <StyledWrapper>
            <StyledLogo />
            <StyledTitle>¡Oh no!</StyledTitle>
            <StyledText>Esta aplicación aún no está disponible para dispositivos móviles.</StyledText>
            <StyledLink href={process.env.NEXT_PUBLIC_INDEX_URL} variant='secondary' noBackground>
              Volver al home
            </StyledLink>
          </StyledWrapper>
        </LayoutBase>
      ) : (
        children
      )}
    </>
  );
}
