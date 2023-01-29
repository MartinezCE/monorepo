import styled from 'styled-components';

export const Conatiner = styled.div`
  width: 100%;
`;

export const Label = styled.p`
  font-size: 1em;
  font-weight: 400;
  margin-bottom: 5px;
  margin-left: 5px;
`;

export const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  width: 100%;

  @keyframes progress {
    from {
      width: 0;
    }
  }

  .progress-bar {
    height: 24px;
    border-radius: 20px;
    min-width: 0;
    background-color: ${({ theme }) => theme.colors.blue};
    animation: progress 1500ms ease-in-out 1;
  }

  .progress-percentage {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;
