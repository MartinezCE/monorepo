import { Checkbox } from '@wimet/apps-shared';
import { ChangeEvent } from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  line-height: ${({ theme }) => theme.lineHeights[1]};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: center;
  column-gap: 12px;
  cursor: pointer;
`;

const StyledCheckbox = styled(Checkbox)`
  border: 2px solid ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

type Props = {
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  className?: string;
};

// TODO: Remove this component and just pass a label prop to the default Checkbox.

export default function LabeledCheckbox({ label, onChange, checked, className }: Props) {
  return (
    <StyledLabel className={className}>
      <StyledCheckbox checked={checked} onChange={onChange} />
      {label}
    </StyledLabel>
  );
}
