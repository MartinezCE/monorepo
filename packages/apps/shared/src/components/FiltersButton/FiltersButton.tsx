import styled, { css } from 'styled-components';
import Button from '../Button';
import { images } from '../../assets';

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 6px;
`;

type StyledBadgeProps = {
  isActive?: boolean;
};

const StyledBadge = styled.div<StyledBadgeProps>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${({ theme }) => theme.colors.sky};
    `}
`;

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: ${({ theme }) => theme.fontSizes[4]};
  line-height: ${({ theme }) => theme.lineHeights[2]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  column-gap: 16px;
`;

type Props = {
  isActive?: boolean;
  onClick?: () => void;
};

export default function FiltersButton({ isActive, onClick }: Props) {
  return (
    <StyledRow>
      <StyledBadge isActive={isActive} />
      <StyledButton trailingIcon={<images.Filter />} onClick={onClick} noBackground>
        Filtros
      </StyledButton>
    </StyledRow>
  );
}
