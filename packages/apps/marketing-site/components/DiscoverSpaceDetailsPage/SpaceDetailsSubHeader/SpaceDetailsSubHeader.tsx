import styled from 'styled-components';
import { Button, images, Text, Tooltip, Space } from '@wimet/apps-shared';

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
`;

const StyledPreTitleWrapper = styled.div`
  margin-top: 64px;
  color: ${({ theme }) => theme.colors.darkBlue};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
  }
`;

const StyledTitleRow = styled(StyledRow)`
  column-gap: 32px;
  margin-top: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > button {
      display: none;
    }
  }
`;

const StyledTitle = styled.h6`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

// TODO: Use this to display url
// const StyledLink = styled(Link)`
//   color: ${({ theme }) => theme.colors.black};
//   font-weight: ${({ theme }) => theme.fontWeight[1]};
//   font-size: ${({ theme }) => theme.fontSizes[4]};
//   line-height: ${({ theme }) => theme.lineHeights[2]};
//   column-gap: 8px;

//   &:hover,
//   &:focus,
//   &:active {
//     color: ${({ theme }) => theme.colors.black};
//   }
// `;

const StyledTooltip = styled(Tooltip)`
  display: none;
  width: 228px;
`;

// TODO: Use this to display url
// const StyledInlineLink = styled(Link)`
//   width: fit-content;
//   display: inline-block;
//   font-size: ${({ theme }) => theme.fontSizes[0]};
//   line-height: ${({ theme }) => theme.lineHeights[0]};
//   font-weight: ${({ theme }) => theme.fontWeight[1]};
//   color: ${({ theme }) => theme.colors.blue};

//   :hover,
//   :active,
//   :focus {
//     color: ${({ theme }) => theme.colors.blue};
//   }
// `;

const StyledBadge = styled(Button)`
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
  position: relative;

  :hover ${StyledTooltip} {
    display: block;
  }
`;

const StyledSafeIcon = styled(images.Safe)`
  color: ${({ theme }) => theme.colors.blue};

  > :nth-child(2) {
    fill: ${({ theme }) => theme.colors.white};
  }
`;

const StyledLocationIcon = styled(images.Pin)`
  color: ${({ theme }) => theme.colors.orange};
  min-width: 20px;
`;

const StyledAddressRow = styled(StyledRow)`
  column-gap: 8px;
  margin-top: 20px;
`;

const StyledMobileSubHeader = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 12px;
  }
`;

const Badge = () => (
  <StyledBadge variant='fourth' leadingIcon={<StyledSafeIcon />}>
    Espacio Seguro
    <StyledTooltip>
      Este espacio ha cumplido nuestros requisitos de excelencia en seguridad e higiene.{' '}
      {/* <StyledInlineLink variant='secondary' href='https://areatresworkplace.com/' noBackground>
      Ver más
    </StyledInlineLink> */}
    </StyledTooltip>
  </StyledBadge>
);

type Props = {
  space: Partial<Space>;
};

export default function SpaceDetailsSubHeader({ space }: Props) {
  return (
    <>
      <StyledMobileSubHeader>
        <div />
        <Badge />
      </StyledMobileSubHeader>
      <StyledPreTitleWrapper>
        <images.BiggerHouse />
      </StyledPreTitleWrapper>
      <StyledTitleRow>
        <StyledTitle>{space?.location?.name}</StyledTitle>
        {/* <StyledLink leadingIcon={<images.ArrowUpRight />} noBackground>
          huertacowork.com
        </StyledLink> */}
        <Badge />
      </StyledTitleRow>
      <StyledAddressRow>
        <StyledLocationIcon />
        <Text variant='large'>{space?.location?.address}</Text>
      </StyledAddressRow>
    </>
  );
}
