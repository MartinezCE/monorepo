/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import React, { Fragment, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { getIn, useFormikContext } from 'formik';
import Button from '../Button';
import Input from '../Input';
import { TinyClose, TinyEdit } from '../../assets/images';
import { ButtonMixinProps } from '../../common/mixins';

const StyledBaseTitle = css`
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  font-size: ${({ theme }) => theme.fontSizes[5]};
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  line-height: ${({ theme }) => theme.lineHeights[3]};
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
`;

type StyledButtonProps = {
  buttonLeftSeparation: number;
};
const StyledButton = styled(Button)<StyledButtonProps>`
  margin-left: ${({ buttonLeftSeparation }) => buttonLeftSeparation}px;
  width: 32px;
  height: 32px;
  padding: 0;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  column-gap: 2px;
`;

const StyledInputInnerWrapper = styled.div`
  position: relative;
`;

const StyledHiddenPlaceholder = styled.span`
  ${StyledBaseTitle};
  width: 0;
  height: 0;
  visibility: hidden;
  position: absolute;
`;

const StyledInput = styled(Input)`
  div,
  input {
    ${StyledBaseTitle};
    background: transparent;
    border: 0;
    padding: 0;
    outline: none;
    border: none !important;
  }

  span {
    white-space: nowrap;
  }
`;

const StyledSave = styled(Button)`
  margin-left: 20px;
  margin-right: 10px;
  align-items: baseline;
`;

const StyledTinyClose = styled(TinyClose)`
  color: ${({ theme }) => theme.colors.gray};
`;

type Props = {
  names: string[];
  placeholders?: string[];
  buttonVariant?: ButtonMixinProps['variant'];
  buttonLeftSeparation?: number;
  className?: string;
  onSave?: () => void;
};

const TitleEditable = ({
  names,
  placeholders,
  buttonVariant = 'transparent',
  buttonLeftSeparation = 0,
  className,
  onSave,
}: Props) => {
  const [readOnly, setReadOnly] = useState(true);
  const placeholderRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const formik = useFormikContext();

  const adjustInputWidth = () => {
    if (!inputRefs.current.length) return;
    inputRefs.current.forEach((ref, i) => {
      if (!ref) return;
      ref.style.width = '0';

      const width =
        getIn(formik.values, ref.name) || !ref.hasAttribute('placeholder')
          ? ref.scrollWidth
          : placeholderRefs.current[i].scrollWidth;

      ref.style.width = `calc(${width ? 0.5 : 0.1}ch + ${width}px)`;
    });
  };

  const handleReadOnlyChange = () => setReadOnly(!readOnly);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleReadOnlyChange();
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (readOnly || inputRefs.current.some(el => el === e.relatedTarget)) return;
    handleReadOnlyChange();
    formik.handleBlur(e);
    onSave?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    adjustInputWidth();
  };

  useEffect(() => {
    if (readOnly) return;

    const ref = inputRefs.current[0];
    ref.focus();
    ref.setSelectionRange(ref.value.length, ref.value.length);
  }, [readOnly]);

  return (
    <StyledWrapper className={className}>
      <StyledInputWrapper>
        {names.map((name, i) => (
          <StyledInputInnerWrapper key={name}>
            <StyledHiddenPlaceholder ref={el => (placeholderRefs.current[i] = el)}>
              {placeholders?.[i]}
            </StyledHiddenPlaceholder>
            <StyledInput
              ref={el => {
                inputRefs.current[i] = el;
                adjustInputWidth();
              }}
              placeholder={placeholders?.[i]}
              readOnly={readOnly}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              disabled={readOnly}
              type='text'
              name={name}
            />
          </StyledInputInnerWrapper>
        ))}
      </StyledInputWrapper>
      {readOnly && (
        <StyledButton
          variant={buttonVariant}
          buttonLeftSeparation={buttonLeftSeparation}
          onClick={handleReadOnlyChange}>
          <TinyEdit />
        </StyledButton>
      )}
      {!readOnly && names.length > 1 && (
        <>
          <StyledSave
            variant='outline'
            onClick={() => {
              handleReadOnlyChange();
              onSave?.();
            }}
            noBackground>
            Guardar
          </StyledSave>
          <Button variant='transparent' onClick={handleReadOnlyChange} leadingIcon={<StyledTinyClose />} />
        </>
      )}
    </StyledWrapper>
  );
};

export default TitleEditable;
