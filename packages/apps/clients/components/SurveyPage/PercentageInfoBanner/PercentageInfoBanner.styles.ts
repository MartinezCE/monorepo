import styled from 'styled-components';

export const BannerWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  display: flex;
  padding: 30px 40px;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
`;

export const PercentageCard = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
  padding: 40px 0;
  max-width: 50%;
  flex: 1 1 0px;

  &:not(:last-child) {
    margin-right: 45px;
    border-right: solid 1px ${({ theme }) => theme.colors.black};
  }
`;

export const PercentageNumber = styled.p`
  font-size: 3em;
  color: ${({ theme }) => theme.colors.blue};
  font-weight: 700;
`;

export const PercentageDetail = styled.p`
  padding-right: 25px;
  font-size: 1em;
  font-weight: 400;
  line-height: 1.3em;

  &::first-letter {
    text-transform: capitalize;
  }
`;
