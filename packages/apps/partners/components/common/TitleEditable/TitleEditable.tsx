import React, { useState } from 'react';
import { images, Button, Input } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import { useFormikContext } from 'formik';
import type { EditSpaceInitialValues } from '../../../pages/locations/[locationId]/spaces/[spaceId]/edit';

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

const EditableTitle: React.FC = () => {
  const [readOnly, setReadOnly] = useState(true);
  const ref = React.useRef<HTMLInputElement | null>(null);
  const formik = useFormikContext<EditSpaceInitialValues>();

  const adjustInputWidth = () => {
    if (!ref.current) return;
    ref.current.style.width = '0';

    const width = ref.current.scrollWidth;
    ref.current.style.width = `calc(${width ? 0.5 : 0.1}ch + ${width}px)`;
  };

  const handleReadOnlyChange = () => {
    const newReadOnly = readOnly;
    setReadOnly(!newReadOnly);
  };

  const handleEditButton = () => {
    handleReadOnlyChange();
    ref.current?.focus();
    ref.current?.setSelectionRange(ref.current?.value.length, ref.current?.value.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handleReadOnlyChange();
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (readOnly) return;
    handleReadOnlyChange();
    formik.handleBlur(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    adjustInputWidth();
  };

  return (
    <StyledWrapper>
      <StyledInput
        ref={el => {
          ref.current = el;
          adjustInputWidth();
        }}
        readOnly={readOnly}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        type='text'
        name='name'
      />
      {readOnly && (
        <Button variant='transparent'>
          <images.TinyEdit onClick={handleEditButton} />
        </Button>
      )}
    </StyledWrapper>
  );
};

export default EditableTitle;
