import { ChangeEvent, ComponentProps, useEffect, useState } from 'react';
import styled from 'styled-components';
import Input from '../Input';
import Button from '../Button';
import { images } from '../../assets';

const StyledInput = styled(Input)`
  width: 103px;

  > div {
    height: 32px;
    border: 1px solid ${({ theme }) => theme.colors.gray};
    transition: all 0.1s linear;

    &:hover {
      border-color: ${({ theme }) => theme.colors.black};
    }

    input {
      padding: 6px 0;
      text-align: center;
    }
  }
`;

const StyledButton = styled(Button)`
  padding: 0 10px;
  margin: 0;
  height: 100%;
  border-radius: unset;
  &:hover,
  &:active,
  &:focus,
  &:disabled,
  &:disabled:hover,
  &:disabled:focus {
    background-color: transparent;
  }
`;

const StyledAddButton = styled(StyledButton)`
  &:disabled,
  &:disabled:hover,
  &:disabled:focus {
    color: ${({ theme }) => theme.colors.orange};
  }
`;

type Props = Omit<ComponentProps<typeof Input>, 'onChange'> & {
  onChange?: (value: number) => void;
};

export default function InputSpinner({ onChange, ...props }: Props) {
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    const newInputValue = Math.round(Number(props.value) || 0);
    setInputValue(newInputValue);
    onChange?.(newInputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = Math.round(Number(e.target.value) || 0);
    setInputValue(newInputValue);
    onChange?.(newInputValue);
  };

  const onSubstract = () => {
    if (inputValue - 1 < props.min) return;
    const newInputValue = inputValue - 1;
    setInputValue(newInputValue);
    onChange?.(newInputValue);
  };

  const onAdd = () => {
    if (inputValue + 1 > props.max) return;
    const newInputValue = inputValue + 1;
    setInputValue(newInputValue);
    onChange?.(newInputValue);
  };

  return (
    <StyledInput
      type='number'
      step={1}
      variant='withText'
      value={inputValue.toString()}
      onChange={handleOnChange}
      leadingAdornment={
        <StyledButton
          leadingIcon={<images.Less />}
          variant='input'
          onClick={() => onSubstract()}
          disabled={props.min === inputValue}
        />
      }
      trailingAdornment={
        <StyledAddButton
          leadingIcon={<images.TinyMore />}
          variant='input'
          onClick={() => onAdd()}
          disabled={props.max === inputValue}
        />
      }
      {...props}
    />
  );
}
