import React from 'react';
import styled, { css } from 'styled-components';
import { theme as ImportedTheme } from '../../common';
import { LayoutVariant } from '../../types';
import Avatar from '../Avatar';

type TextPosition = 'left' | 'right';
type Size = 'small' | 'medium' | 'large';

const SizeConfig: { [key in Size]?: number } = {
  large: 23,
  small: 6,
};

const ContainerNameColorConfig: { [key in LayoutVariant]?: string } = {
  orange: ImportedTheme.colors.orangeOpacity25,
  blue: ImportedTheme.colors.extraLightBlue,
  sky: 'rgba(82, 196, 255, 0.1)',
};

const NameColorConfig: { [key in LayoutVariant]?: string } = {
  orange: ImportedTheme.colors.orange,
  blue: ImportedTheme.colors.blue,
  sky: ImportedTheme.colors.sky,
};

type StyledNameContainerProps = {
  size: Size;
  textPosition: TextPosition;
};

const StyledNameContainer = styled.div<StyledNameContainerProps>`
  height: 28px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 4px 10px;
  transition: background-color 0.2s ease-in-out;

  ${({ size, textPosition }) => css`
    margin-right: ${textPosition === 'right' ? 0 : SizeConfig[size]}px;
    margin-left: ${textPosition === 'left' ? 0 : SizeConfig[size]}px;
  `}
`;

type LayoutThemeProps = {
  variant: LayoutVariant;
  size: Size;
  textDark: boolean;
};

const StyledName = styled.span<LayoutThemeProps>`
  ${({ theme, variant, size, textDark }) => css`
    color: ${textDark ? theme.colors.darkBlue : NameColorConfig[variant]};
    font-size: ${size === 'large' ? '24px' : '16px'};
  `}
`;

type StyledWrapperProps = {
  textPosition: TextPosition;
  variant?: LayoutVariant;
  transparent: boolean;
};

const StyledWrapper = styled.div<StyledWrapperProps>`
  display: flex;
  cursor: pointer;
  align-items: center;
  flex-flow: ${({ textPosition }) => (textPosition === 'left' ? 'row' : 'row-reverse')};

  &:hover {
    ${StyledNameContainer} {
      ${({ variant, transparent }) => css`
        cursor: ${transparent ? 'default' : 'pointer'};
        background-color: ${transparent ? 'transparent' : ContainerNameColorConfig[variant]};
      `}
    }
  }
`;

const AvatarSizeConfig = { large: 72, medium: 44, small: 36 };

type Props = {
  className?: string;
  name?: string;
  variant?: LayoutVariant;
  showUserLabel?: boolean;
  size?: Size;
  textPosition?: TextPosition;
  transparent?: boolean;
  textDark?: boolean;
  image?: string;
  borderWidth?: number;
  onClickAdd?: () => void;
};

const Profile: React.FC<Props> = ({
  className,
  name,
  variant = 'orange',
  showUserLabel = true,
  size = 'small',
  textPosition = 'left',
  transparent = false,
  textDark = false,
  borderWidth,
  image,
  onClickAdd,
}) => (
  <StyledWrapper className={className} variant={variant} textPosition={textPosition} transparent={transparent}>
    {!!showUserLabel && (
      <StyledNameContainer size={size} textPosition={textPosition}>
        <StyledName variant={variant} size={size} textDark={textDark}>
          {name}
        </StyledName>
      </StyledNameContainer>
    )}
    <Avatar
      image={image}
      variant={variant}
      size={AvatarSizeConfig[size]}
      borderWidth={borderWidth}
      onClickAdd={onClickAdd}
    />
  </StyledWrapper>
);

export default Profile;
