import Image from 'next/image';
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { images } from '../../assets';
import { theme as ImportedTheme } from '../../common';
import { LayoutVariant } from '../../types';
import Button from '../Button';

const StyledWrapper = styled.div`
  position: relative;
`;

const config = {
  orange: ImportedTheme.colors.orange,
  blue: ImportedTheme.colors.blue,
  gray: ImportedTheme.colors.gray,
  lighterGray: ImportedTheme.colors.lighterGray,
  sky: ImportedTheme.colors.sky,
  white: ImportedTheme.colors.white,
  transparent: 'transparent',
};

type StyledCommonProps = {
  size: number;
  variant?: LayoutVariant;
  borderWidth?: number;
};

const StyledImageWrapper = styled.div<StyledCommonProps>`
  position: relative;
  border-radius: 999px;
  overflow: hidden;

  ${({ variant, size, borderWidth }) => css`
    border: ${`${borderWidth || (size < 50 ? 2 : 3)}px solid ${config[variant]}`};
  `}

  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledImg = styled.img`
  max-width: unset;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const StyledProfileIcon = styled(images.Profile)<StyledCommonProps>`
  width: ${({ size }) => `calc(${size / 2 + 2}px)`};
  height: ${({ size }) => `calc(${size / 2 + 2}px)`};
`;

const StyledAddButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  bottom: 6px;
  right: -6px;
  & button {
    width: 24px;
    height: 24px;
    padding: 0;
    margin: 0;
    border-radius: 999px;
  }
`;

type Props = {
  className?: string;
  size?: number;
  image?: string;
  variant: LayoutVariant;
  borderWidth?: number;
  onClickAdd?: () => void;
  optimizedImg?: boolean;
  children?: React.ReactNode;
};

const Avatar: React.FC<Props> = ({
  className,
  size = 36,
  image,
  variant,
  onClickAdd,
  borderWidth,
  optimizedImg = true,
  children,
}) => {
  const imageComponent = useMemo(() => {
    if (image) {
      if (optimizedImg) return <Image src={image} layout='fill' objectFit='cover' objectPosition='center' />;
      return <StyledImg src={image} />;
    }
    if (children) return children;
    return <StyledProfileIcon size={size} />;
  }, [children, image, optimizedImg, size]);

  return (
    <StyledWrapper className={className}>
      <StyledImageWrapper size={size} variant={variant} borderWidth={borderWidth}>
        {imageComponent}
      </StyledImageWrapper>
      {onClickAdd && (
        <StyledAddButton>
          <Button variant='secondary' onClick={onClickAdd}>
            <images.TinyMore />
          </Button>
        </StyledAddButton>
      )}
    </StyledWrapper>
  );
};

export default Avatar;
