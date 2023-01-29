import styled, { css } from 'styled-components';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Location, Search } from '../../../assets/images';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import Text from '../../UI/Text';
import Dropdown from '../../UI/Dropdown';
import { Layout } from '../../mixins';
import Link from '../../UI/Link';
import { BlockMainHero } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled.div`
  ${Layout}
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  column-gap: 30px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xxl}) {
    padding: 0 108px;
    padding-right: 40px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: auto;
    justify-content: center;
    column-gap: 0;
    padding: 32px 24px;
    text-align: center;
  }
`;

const StyledLeftSide = styled.div`
  width: 100%;
  max-width: 540px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-self: flex-start;
  padding: 100px 0;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 50px 0;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-self: center;
    align-items: center;
    padding: 0;
  }
`;

const StyledTitle = styled.h1`
  max-width: 510px;
  font-size: ${({ theme }) => theme.fontSizes[8]};
  line-height: ${({ theme }) => theme.lineHeights[6]};
  margin-bottom: 32px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.fontSizes[7]};
    line-height: ${({ theme }) => theme.lineHeights[5]};
    margin-bottom: 16px;
  }
`;

const StyledDescription = styled(Text)`
  max-width: 415px;
  margin-bottom: 64px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-bottom: 40px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes[2]};
    line-height: ${({ theme }) => theme.lineHeights[1]};
  }
`;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: wrap;
  column-gap: 32px;
  row-gap: 16px;
  margin-bottom: 90px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin-bottom: 50px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: space-between;
    width: 100%;

    > * {
      width: 100%;
    }
  }
`;

const StyledLink = styled(Link)`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const StyledStack = styled.div`
  position: relative;
`;

type StyledAnimatedButtonProps = {
  animate?: boolean;
};

const StyledAnimatedButton = styled(Button)<StyledAnimatedButtonProps>`
  position: relative;
  width: 100%;
  transition: background-color 0.1s ease-in-out, opacity 0.1s ease-in-out;

  ${({ animate }) =>
    animate &&
    css`
      opacity: 0;
      pointer-events: none;
    `}

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const StyledSearchIcon = styled(Search)`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

type StyledInputProps = {
  animate?: boolean;
};

const StyledInput = styled(Input)<StyledInputProps>`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  ${({ animate }) =>
    !animate &&
    css`
      opacity: 0;
    `}

  > div {
    border: 1px solid ${({ theme }) => theme.colors.blue};

    > input {
      padding: 0 26px;

      @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
        ::placeholder {
          text-align: center;
          padding-left: 48px;
        }
      }
    }
  }
`;

const StyledSearchButton = styled(Button)`
  width: 66px;
  border-radius: 0;
  justify-content: center;
  padding: 0;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 48px;
  }
`;

type StyledDropdownWrapperProps = {
  showDropdown?: boolean;
};

const StyledDropdownWrapper = styled.div<StyledDropdownWrapperProps>`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  display: none;

  ${({ showDropdown }) =>
    showDropdown &&
    css`
      ${StyledStack}:hover & {
        display: block;
      }
    `}
`;

const StyledDropdown = styled(Dropdown)`
  position: relative;
  max-height: 156px;
  margin-top: 16px;
`;

const StyledDropdownLink = styled(Link)`
  color: ${({ theme }) => theme.colors.darkGray};
  justify-content: unset;
  padding: 14px 16px;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const StyledImageContainer = styled.div`
  width: fit-content;
  height: 100%;
  max-width: 700px;
  position: relative;
  flex-shrink: 0;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    max-width: 490px;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const StyledLogosContainer = styled.div`
  width: 100%;
  opacity: 60%;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  position: relative;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    column-gap: 0;
  }
`;

const StyledLogoContent = styled.div`
  height: 100%;
  position: relative;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 25px !important;
  }

  * {
    min-height: 100% !important;
    height: 100% !important;
  }
`;

type Props = BlockMainHero;

export default function MainHero({ text, title, button, selectButton, image, footerImages }: Props) {
  const [searchValue, setSearchValue] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleClickCTAButton = () => setShowSearchInput(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <StyledWrapper>
      <StyledLeftSide data-aos='fade-right'>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription variant='large'>{text}</StyledDescription>
        <StyledButtonRow>
          <StyledLink variant='tertiary' href={button?.link} target={button?.openNewTab ? '_blank' : '_self'}>
            {button?.text}
          </StyledLink>
          {selectButton && (
            <StyledStack>
              <StyledInput
                placeholder={selectButton.placeholder}
                value={searchValue}
                trailingAdornment={<StyledSearchButton variant='secondary' trailingIcon={<StyledSearchIcon />} />}
                animate={showSearchInput}
                onChange={handleChange}
                disabled
              />
              <StyledDropdownWrapper showDropdown={showSearchInput}>
                <StyledDropdown>
                  {(selectButton.options || []).map(location => (
                    <StyledDropdownLink
                      key={location.id}
                      href={location?.link}
                      target={location?.openNewTab ? '_blank' : '_self'}
                      leadingIcon={<Location />}
                      variant='fourth'
                      fullWidth>
                      {location?.text}
                    </StyledDropdownLink>
                  ))}
                </StyledDropdown>
              </StyledDropdownWrapper>
              <StyledAnimatedButton
                variant='secondary'
                trailingIcon={<StyledSearchIcon />}
                onClick={handleClickCTAButton}
                animate={showSearchInput}>
                {selectButton?.text}
              </StyledAnimatedButton>
            </StyledStack>
          )}
        </StyledButtonRow>
        <StyledLogosContainer>
          {footerImages?.data?.map(({ attributes }) => (
            <StyledLogoContent key={attributes.hash}>
              <Image {...getImageProps({ data: { attributes } })} objectFit='contain' priority />
            </StyledLogoContent>
          ))}
        </StyledLogosContainer>
      </StyledLeftSide>
      <StyledImageContainer>
        <Image {...getImageProps(image)} objectFit='contain' objectPosition='top right' priority />
      </StyledImageContainer>
    </StyledWrapper>
  );
}
