/* eslint-disable @typescript-eslint/no-explicit-any */
import * as S from './SquarePill.styles';

const SquarePill = ({ children }: { children: React.ReactElement | any }) => (
  <S.SquarePillWrapper>{children}</S.SquarePillWrapper>
);

export default SquarePill;
