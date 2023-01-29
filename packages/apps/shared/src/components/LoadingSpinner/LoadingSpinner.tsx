import styled from 'styled-components';

const StyledSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid ${({ theme }) => theme.colors.gray};
  width: 16px;
  height: 16px;
  animation: spin 0.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

type Props = {
  className?: string;
};

export default function LoadingSpinner({ className }: Props) {
  return <StyledSpinner className={className} />;
}
