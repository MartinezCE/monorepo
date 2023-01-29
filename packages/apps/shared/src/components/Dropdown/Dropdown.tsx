import { forwardRef, ReactNode, Ref } from 'react';
import styled from 'styled-components';

const StyledDropdown = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 20px 40px -12px ${({ theme }) => theme.colors.gray}26;
  z-index: 3;
  background-color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  children?: ReactNode;
  className?: string;
};

function Dropdown({ children, className, ...props }: Props, ref: Ref<HTMLDivElement>) {
  return (
    <StyledDropdown ref={ref} className={className} {...props}>
      {children}
    </StyledDropdown>
  );
}

export default forwardRef<HTMLDivElement, Props>(Dropdown);
