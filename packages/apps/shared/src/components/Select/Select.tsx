import { useField } from 'formik';
import { ComponentProps, memo } from 'react';
import ReactSelect, { GroupBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectComponents } from 'react-select/dist/declarations/src/components';
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { Button, Dropdown, LoadingSpinner } from '..';
import { images } from '../..';
import { getError } from '../../utils/form';
import ErrorText from '../ErrorText';
import primaryVariant from './primaryVariant';
import secondaryVariant from './secondaryVariant';
import tertiaryVariant from './tertiaryVariant';

type StyledReactSelectProps = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  alignMenu?: 'center' | 'left';
};

const variants: { [key in StyledReactSelectProps['variant']]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {
  primary: primaryVariant,
  secondary: secondaryVariant,
  tertiary: tertiaryVariant,
};

const StyledWrapper = styled.div<{ hasError: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 8px;
  position: relative;

  ${({ hasError }) =>
    hasError &&
    css`
      .react-select__control {
        border-color: ${({ theme }) => theme.colors.error} !important;
      }
    `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: 500;
`;

const StyledDropdown = styled(Dropdown)<{ maxMenuHeight: number }>`
  margin-top: 8px;
  max-height: ${({ maxMenuHeight }) => maxMenuHeight}px;
  overflow-y: auto;
`;

const StyledBaseSelect = css<StyledReactSelectProps>`
  .react-select__control {
    .react-select__indicators svg {
      transition: transform 0.1s linear;
    }
    &--menu-is-open {
      .react-select__indicators svg {
        transform: rotate(180deg);
      }
    }
    .react-select__value-container--is-multi {
      height: auto !important;
      .react-select__multi-value {
        padding: 3px 0;
        border-radius: 40px;
        background: ${({ theme }) => theme.colors.extraLightGray};
        .react-select__multi-value__remove {
          cursor: pointer;
          background: ${({ theme }) => theme.colors.white};
          border-radius: 50%;
          margin-left: 2px;
          margin-right: 10px;
          width: 20px;
        }
      }
      & + .react-select__indicators {
        height: 100%;
        align-self: unset;
      }
    }
  }
  ${({ variant, alignMenu }) => css`
    ${variants[variant]}
    ${variant !== 'primary' &&
    css`
      ${StyledDropdown} {
        min-width: 100%;
        width: max-content;
      }
    `}
    ${alignMenu === 'center' &&
    css`
      ${StyledDropdown} {
        left: 50%;
        transform: translateX(-50%);
      }
    `};
  `}
`;

const StyledReactSelect = styled(ReactSelect)<StyledReactSelectProps>`
  ${StyledBaseSelect}
`;

const StyledCreatableSelect = styled(CreatableSelect)<StyledReactSelectProps>`
  ${StyledBaseSelect};
  height: 100% !important;
  max-height: 88px;
  .react-select {
    &__control {
      height: 100%;
      max-height: 88px;
      overflow: auto;
    }
  }
`;

const StyledCreatableLabel = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  justify-content: center;
  gap: 10px;
  font-weight: ${({ theme }) => theme.fontWeight[2]};
`;

type StyledDropdownItemProps = {
  isSelected?: boolean;
};

const StyledButton = styled(Button)<StyledDropdownItemProps>`
  justify-content: unset;
  padding: 14px 16px;
  color: ${({ theme }) => theme.colors.darkGray};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: ${({ theme }) => theme.fontWeight[1]};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.extraLightGray};
  }

  ${({ isSelected }) =>
    isSelected &&
    css`
      &,
      &:hover,
      &:focus {
        background-color: ${({ theme }) => theme.colors.extraLightGray};
        color: ${({ theme }) => theme.colors.blue};
      }
      &:disabled {
        color: ${({ theme }) => theme.colors.darkGray};
        background-color: ${({ theme }) => theme.colors.extraLightGray};
      }
    `}

  &:disabled, &:disabled:hover {
    color: ${({ theme }) => theme.colors.gray};
    background-color: transparent;
  }
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  grid-area: 1/1/2/3;
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[1]};
`;

const StyledDescription = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  color: ${({ theme }) => theme.colors.gray};
  text-align: left;
`;

const CustomMenu = ({ children, theme, ...props }) => {
  const { innerProps, innerRef, className, cx, ...remainingProps } = props;

  return (
    <StyledDropdown ref={innerRef} {...innerProps} {...remainingProps}>
      {children}
    </StyledDropdown>
  );
};

const CustomList = ({ children }) => <>{children}</>;

const CustomOption = ({ children, theme, ...props }) => {
  const { label, data, innerProps, innerRef, cx, isDisabled, ...remainingProps } = props;
  return (
    <StyledButton ref={innerRef} variant='fourth' fullWidth disabled={isDisabled} {...innerProps} {...remainingProps}>
      {children}
      {data.description && <StyledDescription>{data.description}</StyledDescription>}
    </StyledButton>
  );
};

const CustomDropdownIndicator = ({ theme, ...props }) => {
  const { innerProps, innerRef } = props;

  return <images.TinyChevronDown ref={innerRef} {...innerProps} />;
};

const CustomSingleValue = ({ children, theme, prefix, ...props }) => {
  const { innerProps, innerRef } = props;

  return (
    <StyledText ref={innerRef} {...innerProps}>
      {prefix && <strong>{prefix}</strong>} {children}
    </StyledText>
  );
};

type Props = (ComponentProps<typeof ReactSelect> | ComponentProps<typeof CreatableSelect>) & {
  className?: string;
  label?: string;
  prefix?: string;
  variant?: StyledReactSelectProps['variant'];
  instanceId: string | number;
  alignMenu?: StyledReactSelectProps['alignMenu'];
  isCreatable?: boolean;
  createLabel?: string;
};

export default function Select({
  className,
  label,
  theme,
  classNamePrefix,
  prefix,
  variant = 'primary',
  alignMenu = 'left',
  isCreatable = false,
  createLabel = '',
  ...props
}: Props) {
  const [field, meta, helpers] = useField(props?.name);

  const error = meta.touched ? getError(meta.error) : undefined;

  const components: Partial<SelectComponents<unknown, boolean, GroupBase<unknown>>> = {
    IndicatorSeparator: null,
    Menu: CustomMenu,
    MenuList: CustomList,
    Option: CustomOption,
    LoadingIndicator: LoadingSpinner,
  };

  if (variant !== 'primary') components.DropdownIndicator = CustomDropdownIndicator;
  if (prefix) components.SingleValue = memo(_props => <CustomSingleValue {..._props} prefix={prefix} />);

  const RenderSelect = () => {
    const commonProps = {
      onChange: value => helpers.setValue(props.isMulti ? value : value.value),
      onBlur: () => helpers.setTouched(true),
      classNamePrefix: 'react-select',
      variant,
      alignMenu,
      components,
      ...props,
    };
    if (isCreatable) {
      return (
        <StyledCreatableSelect
          formatCreateLabel={inputText => (
            <StyledCreatableLabel>
              <images.TinyMore />
              {`${createLabel} "${inputText}"`}
            </StyledCreatableLabel>
          )}
          {...commonProps}
        />
      );
    }
    return (
      <StyledReactSelect
        value={props.options?.find(option => (option as { value: unknown })?.value === field.value)}
        isSearchable={variant === 'primary'}
        {...commonProps}
      />
    );
  };

  return (
    <StyledWrapper className={className} hasError={error}>
      {label && <Label>{label}</Label>}
      {RenderSelect()}
      {error && <ErrorText position='absolute'>{error}</ErrorText>}
    </StyledWrapper>
  );
}
