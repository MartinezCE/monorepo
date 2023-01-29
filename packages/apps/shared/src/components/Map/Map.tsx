import { forwardRef, useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import styled, { createGlobalStyle } from 'styled-components';
import { images } from '../../assets';

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
    height: 100%;
  }

  .gm-style .gm-style-iw-t::after {
    background: none;
    box-shadow: none;
  }

  .gm-style-iw-d + button {
    display: none !important;
  }

  .gm-style-iw-d {
    overflow: hidden !important;
  }

  .gm-style-iw.gm-style-iw-c {
    padding: 0 !important;
    box-shadow: none !important;
  }
`;

const MapStyles = createGlobalStyle`
  .pac-container {
    box-shadow: 0px 20px 40px -12px ${({ theme }) => theme.colors.gray}26;
    border: 0;
    border-radius: 8px;
    padding: 8px;
    margin-top: 8px;
    .pac-item {
      border: 0;
      min-height: 48px;
      align-items: center;
      padding: 14px 16px;
      line-height: ${({ theme }) => theme.lineHeights[0]};
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: ${({ theme }) => theme.colors.extraLightGray};
        span {
          color: ${({ theme }) => theme.colors.blue};
        }
      }
      span {
        font-size: ${({ theme }) => theme.fontSizes[2]}
      }
      .pac-icon {
        display: none;
      }
    }
  }
`;

type StyledButtonContainerProps = {
  show: boolean;
};

const StyledButtonContainer = styled.div<StyledButtonContainerProps>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  height: 64px;
  width: 36px;
  bottom: 20px !important;
  right: 16px !important;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: calc(100% - 10px);
    height: 1px;
    top: 50%;
    left: 5px;
    background: ${({ theme }) => theme.colors.gray};
  }
`;

const StyledButton = styled.button`
  background: transparent;
  border: 0;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
`;

const StyledImageMore = styled(images.More)`
  color: ${({ theme }) => theme.colors.orange};
`;

const StyledImageLess = styled(images.Less)`
  color: ${({ theme }) => theme.colors.orange};
`;

type MapProps = {
  apiKey: string;
  map: google.maps.Map;
  children?: React.ReactNode;
  className?: string;
};

const Map = forwardRef<HTMLDivElement, MapProps>(({ apiKey, map, children, className }, ref) => {
  const zoomRef = useRef(null);

  useEffect(() => {
    map?.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomRef.current);
  }, [map, zoomRef]);

  return (
    <StyledWrapper className={className}>
      <MapStyles />
      <Wrapper apiKey={apiKey} libraries={['places']}>
        <div ref={ref} id='map'>
          {children}
          <StyledButtonContainer show={!!map} ref={zoomRef}>
            <StyledButton onClick={() => map.setZoom(map.getZoom() + 1)} type='button'>
              <StyledImageMore />
            </StyledButton>
            <StyledButton onClick={() => map.setZoom(map.getZoom() - 1)} type='button'>
              <StyledImageLess />
            </StyledButton>
          </StyledButtonContainer>
        </div>
      </Wrapper>
    </StyledWrapper>
  );
});

export default Map;
