/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ImageGallery from 'react-image-gallery';
import ArrowButton from '../ArrowButton';
import Modal from '../Modal';
import { LocationFile, SpaceFile } from '../../types';
import { ChevronLeft, ChevronRight } from '../../assets/images';
import '../../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    background-color: transparent;
    > div > button {
      top: 5.45px;
      right: -32px;
      z-index: 3;
      @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        top: -12%;
        right: -1%;
      }
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 100%;
    width: 100%;
  }
`;
const StyledImageGalleryWrapper = styled.div`
  width: 1034px;
  height: 612px;

  & .image-gallery,
  .image-gallery-content,
  .image-gallery-slide-wrapper,
  .image-gallery-swipe,
  .image-gallery-slides,
  .image-gallery-slide {
    width: 100%;
    height: 100%;
    & img {
      height: 100%;
      object-fit: cover;
    }
  }

  & .image-gallery-index {
    top: 628px;
    height: 32px;
    width: 69px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    transform: translateX(-50%);
    left: 50%;
    background-color: ${({ theme }) => theme.colors.darkGray};
    & span {
      font-size: 14px;
      font-weight: 200;
      color: ${({ theme }) => theme.colors.white};
    }
    & .image-gallery-index-separator {
      margin: 0 4px 0 4px;
    }
  }
  & .image-gallery-image {
    border-radius: 6px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 320px;
    height: 290px;
    & .image-gallery-index {
      top: 110%;
    }
  }
`;

type StyledArrowProps = {
  direction?: 'left' | 'right';
};

const StyledArrow = styled(ArrowButton)<StyledArrowProps>`
  position: absolute;
  top: calc(50% - 16px);
  ${({ direction }) => (!direction || direction === 'left' ? 'left: -83px' : 'right: -83px')};
  color: ${({ theme }) => theme.colors.white};
  z-index: 2;
  background: ${({ theme }) => theme.colors.darkGray};
  height: 48px;
  width: 48px;
  padding: 0;

  &:hover,
  :active,
  :focus {
    background: rgba(44, 48, 56, 0.4);
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    visibility: hidden;
  }

  & svg {
    transform: scale(1.7);
    & path {
      stroke-width: 1.5px;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
    ${({ direction }) => (!direction || direction === 'left' ? 'left: 0%' : 'right: 0%')};
  }
`;

type Props = {
  onClose: () => void;
  imageList: SpaceFile[] | LocationFile[];
  imageClicked: number;
};

const FullscreenPictureModal = ({ onClose, imageList, imageClicked }: Props) => {
  const [imageListParsed, setImageListParsed] = useState<{ original: string; thumbnail: string }[]>([]);

  useEffect(() => {
    const newImageListParsed = imageList.map(image => ({
      original: image.url,
      thumbnail: image.url,
    }));

    setImageListParsed(newImageListParsed);
  }, [imageList]);

  const handleRenderLeftNav = (onClick: React.MouseEventHandler<HTMLElement>, disabled: boolean | undefined) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={e => onClick(e as React.MouseEvent<HTMLElement>)}>
      <StyledArrow leadingIcon={<ChevronLeft />} disabled={disabled} direction='left' />
    </div>
  );

  const handleRenderRightNav = (onClick: React.MouseEventHandler<HTMLElement>, disabled: boolean | undefined) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={e => onClick(e as React.MouseEvent<HTMLElement>)}>
      <StyledArrow leadingIcon={<ChevronRight />} disabled={disabled} direction='right' />
    </div>
  );

  return (
    <StyledWrappedModal onClose={onClose}>
      <StyledImageGalleryWrapper>
        <ImageGallery
          showThumbnails={false}
          useBrowserFullscreen={false}
          items={imageListParsed}
          startIndex={imageClicked}
          showFullscreenButton={false}
          showPlayButton={false}
          renderLeftNav={handleRenderLeftNav}
          renderRightNav={handleRenderRightNav}
          showIndex
          infinite={false}
        />
      </StyledImageGalleryWrapper>
    </StyledWrappedModal>
  );
};

export default FullscreenPictureModal;
