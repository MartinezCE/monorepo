import styled from 'styled-components';
import { images } from '../../assets';

export const InfoBannerWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 22px;
  column-gap: 22px;
  border-radius: 6px;

  &.info {
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
  }

  .info-banner {
    &__text {
      color: ${({ theme }) => theme.colors.darkGray};
      font-size: 0.9em;
      text-align: start;
      line-height: 1.3em;
    }

    &__icon.info {
      color: ${({ theme }) => theme.colors.blue};
    }
  }
`;

export const StyledIcon = styled(images.Info)`
  transform: scale(1.4);
  min-width: fit-content;
`;
