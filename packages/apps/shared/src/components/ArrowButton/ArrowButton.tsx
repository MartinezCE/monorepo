import styled from 'styled-components';
import Button from '../Button';

const ArrowButton = styled(Button)`
  width: 44px;
  height: 44px;
  justify-content: center;
  color: ${({ theme }) => theme.colors.blue};
  background-color: transparent;
  z-index: 1;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.blue};
    background-color: transparent;
  }

  &::before {
    display: none;
  }

  &:disabled {
    background-color: transparent;
  }
`;

export default ArrowButton;
