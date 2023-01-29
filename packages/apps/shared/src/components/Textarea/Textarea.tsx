import React, { ChangeEvent, ComponentPropsWithoutRef, FocusEvent, memo } from 'react';
import styled from 'styled-components';
import Input from '../Input';

const InputAsTextarea = memo(_props => <Input as='textarea' {..._props} />);
const StyledTextarea = styled(InputAsTextarea)`
  > div {
    max-height: unset;

    textarea {
      width: 100%;
      resize: none;
      line-height: ${({ theme }) => theme.lineHeights[1]};
    }
  }
`;

type TextareaProps = ComponentPropsWithoutRef<'textarea'> & {
  className?: string;
  label?: string;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
};

const Textarea: React.FC<TextareaProps> = ({ ...props }) => <StyledTextarea {...props} />;

export default Textarea;
