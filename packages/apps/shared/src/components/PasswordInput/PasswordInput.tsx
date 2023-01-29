import { ComponentProps, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import Input from '../Input';
import { images } from '../../assets';

const StyledButton = styled(Button)`
  margin-right: 6px;
`;

export default function PasswordInput({ ...props }: ComponentProps<typeof Input>) {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <Input
      {...props}
      type={hidePassword ? 'password' : 'text'}
      trailingAdornment={
        <StyledButton
          tabIndex={-1}
          variant='input'
          leadingIcon={hidePassword ? <images.Eye /> : <images.EyeClosed />}
          onClick={() => setHidePassword(!hidePassword)}
        />
      }
    />
  );
}
