import { renderToStaticMarkup } from 'react-dom/server';
import { useCallback } from 'react';
import L from 'leaflet';
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { SpaceTypeEnum, theme as defaultTheme, WPMReservationTypes } from '@wimet/apps-shared';

export type MarkerVariantsTypes =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'MORNING_AFTERNOON'
  | 'MEETING_ROOM'
  | 'ADDING'
  | keyof typeof WPMReservationTypes;

export const MarkerVariants: { [k in MarkerVariantsTypes]: MarkerVariantsTypes } = {
  AVAILABLE: 'AVAILABLE',
  DAYPASS: 'DAYPASS',
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  MORNING_AFTERNOON: 'MORNING_AFTERNOON',
  UNAVAILABLE: 'UNAVAILABLE',
  MEETING_ROOM: 'MEETING_ROOM',
  CUSTOM: 'CUSTOM',
  ADDING: 'ADDING',
};

const MARKER_SPACE_TYPE_OPTIONS = {
  [SpaceTypeEnum.MEETING_ROOM]: MarkerVariants.MEETING_ROOM,
  [SpaceTypeEnum.PRIVATE_OFFICE]: MarkerVariants.MEETING_ROOM,
  [SpaceTypeEnum.SHARED]: MarkerVariants.AVAILABLE,
};

type MarkerConfigType = {
  [k in MarkerVariantsTypes]: FlattenInterpolation<ThemeProps<DefaultTheme>>;
};

const markerConfig: MarkerConfigType = {
  AVAILABLE: css`
    background-color: ${({ theme }) => theme.colors.success};
  `,
  DAYPASS: css`
    background-color: ${({ theme }) => theme.colors.error};
  `,
  MORNING: css`
    background: linear-gradient(
      0deg,
      ${({ theme }) => theme.colors.success} 50%,
      ${({ theme }) => theme.colors.error} 50%
    );
  `,
  AFTERNOON: css`
    background: linear-gradient(
      0deg,
      ${({ theme }) => theme.colors.error} 50%,
      ${({ theme }) => theme.colors.success} 50%
    );
  `,
  MORNING_AFTERNOON: css`
    background-color: ${({ theme }) => theme.colors.error};
  `,
  UNAVAILABLE: css`
    background-color: ${({ theme }) => theme.colors.darkRed};
  `,
  MEETING_ROOM: css`
    background-color: ${({ theme }) => theme.colors.blue};
  `,
  CUSTOM: css`
    background-color: ${({ theme }) => theme.colors.blue};
  `,
  ADDING: css`
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    border-color: ${({ theme }) => theme.colors.gray};
    width: 23px;
    height: 23px;
    border-width: 2.4px;
  `,
};

const StyledMarkerIcon = styled.div<{ variant: MarkerVariantsTypes }>`
  width: 24px;
  height: 24px;
  border-radius: 100px;
  border: solid 2.2px;
  border-color: ${({ theme }) => theme.colors.white};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  ${({ variant }) => markerConfig[variant]}
`;

type CallbackProps = {
  variant: MarkerVariantsTypes;
};

export const getSpaceTypeMarker = (spaceType: SpaceTypeEnum) => MARKER_SPACE_TYPE_OPTIONS[spaceType];

const useGetMarkerIcon = () =>
  useCallback(
    ({ variant }: CallbackProps = { variant: MarkerVariants.AVAILABLE }) =>
      L.divIcon({
        className: '',
        html: renderToStaticMarkup(<StyledMarkerIcon theme={defaultTheme} variant={variant} />),
      }),
    []
  );

export default useGetMarkerIcon;
