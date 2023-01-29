import { Button, images } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';

export const SummaryCardWrapper = styled.div<{ $isColumn: boolean }>`
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 22px;
  width: 100%;
  position: relative;
  transition: box-shadow 0.22s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows[0]};
  }

  ${({ $isColumn }) =>
    $isColumn
      ? css`
          flex-direction: column;
          align-content: center;
          align-items: center;
          justify-content: center;
          row-gap: 20px;

          .info-card-text {
            text-align: center;
            & > * {
              margin: 18px auto;
            }
          }

          .percentage-card-text {
            max-width: 80%;
            margin: auto;
            text-align: center;
            font-size: 1em;
          }

          .percentage-card-btn {
            margin: auto;
          }
        `
      : css`
          column-gap: 20px;
          align-items: center;
        `}
`;

export const ProgressNumber = styled.p`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.darkBlue};
  font-weight: 700;
  max-width: 90px;
`;

export const CircularProgressContainer = styled.div`
  width: 25%;
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;

  & .stars-group {
    transform: scale(1.4);
  }
`;

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

export const Description = styled.p`
  font-size: 1.2em;
  line-height: 1.1em;
  color: ${({ theme }) => theme.colors.darkBlue};

  &.info-card-text {
    font-size: 0.9em;
    line-height: 1.26em;
  }
`;

export const ActionButton = styled(Button)`
  &,
  &.action-card-btn {
    padding-top: 6px;
    padding-bottom: 6px;
    font-weight: 300;
    align-self: flex-start;
  }

  &.info-card-btn {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.blue};
    padding: 0;
    text-decoration: underline;
    margin-top: 6px;
  }
`;

export const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.blue};
`;

export const InfoFloatingIcon = styled(images.StarsGroup)`
  position: absolute;
  filter: invert(50%) sepia(86%) saturate(6000%) hue-rotate(220deg) brightness(100%) contrast(102%);
  top: 16px;
`;

export const SummaryGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 120px);

  & :first-child {
    grid-column: span 2;
    grid-row: 1 / 3;
  }

  & :nth-child(2) {
    grid-row: span 3;
  }

  & :nth-child(3) {
    grid-column-start: 1;
    grid-row: 3 / end;
  }

  & :nth-child(4) {
    grid-column-start: 2;
    grid-row: 3 / end;
  }

  & :nth-child(5) {
    grid-row: 4 / end;
  }

  & :nth-child(8) {
    grid-row: 3 / end;
  }
`;
