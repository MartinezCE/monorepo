import { Badge, Button } from '@wimet/apps-shared';
import styled from 'styled-components';

type StyledBadgeProps = {
  textAttr: string;
};

const StyledBadge = styled(Badge)<StyledBadgeProps>`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[1]};
  padding: 4px 10px;
  font-weight: ${({ theme }) => theme.fontWeight[0]};

  ::before {
    display: block;
    content: '${({ textAttr }) => textAttr}';
    font-weight: ${({ theme }) => theme.fontWeight[1]};
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
`;

const StyledSelectedBadge = styled(StyledBadge)`
  background-color: ${({ theme }) => theme.colors.extraLightBlue};
  color: ${({ theme }) => theme.colors.blue};
  font-weight: ${({ theme }) => theme.fontWeight[1]};
`;

const StyledUnSelectedBadge = styled(StyledBadge)`
  background-color: unset;
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

type Props = {
  onClick?: () => void;
  text: string;
  isActive?: boolean;
};

export default function HeaderBadgeButton({ onClick, text, isActive }: Props) {
  return (
    <Button onClick={onClick} noBackground>
      {isActive ? (
        <StyledSelectedBadge textAttr={text}>{text}</StyledSelectedBadge>
      ) : (
        <StyledUnSelectedBadge textAttr={text}>{text}</StyledUnSelectedBadge>
      )}
    </Button>
  );
}
