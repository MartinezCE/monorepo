import { images, Map, Marker, Text, useMap, Space } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledMapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  margin-top: 48px;
`;

const StyledMap = styled(Map)`
  height: 349px;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledLocationIcon = styled(images.Pin)`
  min-width: 20px;
  color: ${({ theme }) => theme.colors.orange};
`;

const StyledAddressRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  column-gap: 8px;
`;

type Props = {
  space: Partial<Space>;
};

export default function SpaceDetailsMapSection({ space }: Props) {
  const centerLocation = {
    lat: parseFloat(space.location?.latitude || '0'),
    lng: parseFloat(space.location?.longitude || '0'),
  };
  const { map, setRef } = useMap({
    center: centerLocation,
    zoom: 15,
    onClick: () => {},
  });

  return (
    <StyledMapWrapper>
      {space.location && (
        <StyledMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} ref={el => el && setRef(el)} map={map}>
          <Marker position={centerLocation} map={map} />
        </StyledMap>
      )}
      <StyledAddressRow>
        <StyledLocationIcon />
        <Text variant='large'>
          {space?.location?.address}
          <br />
          {`${space?.location?.state}, ${space?.location?.country}`}
        </Text>
      </StyledAddressRow>
    </StyledMapWrapper>
  );
}
