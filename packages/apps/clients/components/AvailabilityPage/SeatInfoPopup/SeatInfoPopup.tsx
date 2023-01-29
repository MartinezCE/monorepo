import { LoadingSpinner } from '@wimet/apps-shared';
import { useEffect, useMemo, useState } from 'react';
import { Popup } from 'react-leaflet';
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import useGetSeat from '../../../hooks/api/useGetSeat';
import useGetSeatWPMReservation from '../../../hooks/api/useGetSeatWPMReservation';
import useAutoPan from '../../../hooks/useAutoPan';
import { MarkerVariants, MarkerVariantsTypes } from '../../../hooks/useGetMarkerIcon';
import usePopupContainerEvents from '../../../hooks/usePopupContainerEvents';
import SeatInfoPopupAvailable from './SeatInfoPopupAvailable';
import SeatInfoPopupDaypass from './SeatInfoPopupDaypass';
import SeatInfoPopupHalfday from './SeatInfoPopupHalfday';
import SeatInfoPopupMultiple from './SeatInfoPopupMultiple';

type HeaderConfigType = {
  [k in MarkerVariantsTypes]?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
};

const headerConfig: HeaderConfigType = {
  DAYPASS: css`
    ${({ theme }) => theme.colors.extraLightRed};
  `,
  MORNING_AFTERNOON: css`
    ${({ theme }) => theme.colors.extraLightRed};
  `,
  MEETING_ROOM: css`
    ${({ theme }) => theme.colors.blueOpacity20};
  `,
};

const headerTagConfig: HeaderConfigType = {
  DAYPASS: css`
    ${({ theme }) => theme.colors.error};
  `,
  MORNING_AFTERNOON: css`
    ${({ theme }) => theme.colors.error};
  `,
  MEETING_ROOM: css`
    ${({ theme }) => theme.colors.blue};
  `,
};

const StyledPopup = styled(Popup)`
  margin: 24px 0 0;
  left: -24px !important;
  bottom: unset !important;

  > .leaflet-popup-content-wrapper {
    width: 248px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 20px 50px ${({ theme }) => theme.colors.darkGrayWithOpacity};
    border-radius: 8px;
    overflow: hidden;
    padding: 0;

    > .leaflet-popup-content {
      margin: unset;

      p {
        margin: unset;
      }
    }
  }

  .leaflet-popup-tip-container {
    display: none;
  }
`;

const StyledHeader = styled.div<{ variant: MarkerVariantsTypes }>`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  background-color: ${({ variant, theme }) => headerConfig[variant] || theme.colors.extraLightGreen};
`;

const StyledHeaderTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
`;

const StyledHeaderTag = styled.div<{ variant: MarkerVariantsTypes }>`
  padding: 2px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  line-height: 28px;
  font-weight: ${({ theme }) => theme.fontWeight[2]};
  background-color: ${({ variant, theme }) => headerTagConfig[variant] || theme.colors.success};
`;

const StyledLoadingSpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export type SeatInfoPopupProps = {
  variant?: MarkerVariantsTypes;
  id: number;
  seatName?: string;
  selectedDate?: Date;
  onReserveClick?: () => void;
  isAddedToReserveList?: boolean;
  isReservable?: boolean;
  onPopupOpen?: (seatId: number) => void;
  onPopupClose?: () => void;
  popupType?: 'default-web' | 'custom-mobile';
};

export default function SeatInfoPopup({
  variant = MarkerVariants.AVAILABLE,
  popupType = 'default-web',
  id,
  seatName,
  selectedDate,
  onPopupOpen,
  onPopupClose,
  ...rest
}: SeatInfoPopupProps) {
  const isFromMobile = popupType === 'custom-mobile';

  const [isVisible, setIsVisible] = useState(false);
  const { data: seatData, isLoading: seatIsLoading, refetch: seatRefetch } = useGetSeat(id, { enabled: isVisible });
  const {
    data: WPMReservationsData,
    isLoading: reservationsIsLoading,
    refetch: reservationsRefetch,
  } = useGetSeatWPMReservation(id, { selectedDate }, { enabled: isVisible });
  const { amenities } = seatData || {};
  const [reservation] = WPMReservationsData || [];

  useAutoPan({ offset: [-24, 24], paddingXY: [35, 65] });
  usePopupContainerEvents({
    popupopen: () => {
      setIsVisible(true);
      onPopupOpen?.(id);

      if (window?.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ id, seatName }));
      }
    },
    popupclose: () => {
      setIsVisible(false);
      onPopupClose?.();
    },
  });

  const props = useMemo(
    () => ({ ...rest, reservation, amenities, isFromMobile }),
    [rest, reservation, amenities, isFromMobile]
  );
  const popupContent = useMemo(
    () => ({
      [MarkerVariants.AVAILABLE]: <SeatInfoPopupAvailable {...{ seatName, ...props }} />,
      [MarkerVariants.MEETING_ROOM]: <SeatInfoPopupAvailable {...{ seatName, WPMReservationsData, ...props }} />,
      [MarkerVariants.MORNING]: <SeatInfoPopupHalfday {...{ seatName, ...props }} />,
      [MarkerVariants.AFTERNOON]: <SeatInfoPopupHalfday {...{ seatName, ...props }} />,
      [MarkerVariants.DAYPASS]: <SeatInfoPopupDaypass reservation={reservation} />,
      [MarkerVariants.MORNING_AFTERNOON]: <SeatInfoPopupMultiple reservations={WPMReservationsData} />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, reservation, WPMReservationsData]
  );

  useEffect(() => {
    if (!isVisible) return;
    seatRefetch();
    reservationsRefetch();
  }, [reservationsRefetch, variant, isVisible, seatRefetch]);

  return (
    <StyledPopup closeButton={false} autoPan={false}>
      {!isFromMobile && (
        <StyledHeader variant={variant}>
          <StyledHeaderTitleWrapper>
            <StyledHeaderTag variant={variant}>{seatName}</StyledHeaderTag>
          </StyledHeaderTitleWrapper>
        </StyledHeader>
      )}
      {seatIsLoading || reservationsIsLoading ? (
        <StyledLoadingSpinnerWrapper>
          <LoadingSpinner />
        </StyledLoadingSpinnerWrapper>
      ) : (
        popupContent[variant]
      )}
    </StyledPopup>
  );
}
