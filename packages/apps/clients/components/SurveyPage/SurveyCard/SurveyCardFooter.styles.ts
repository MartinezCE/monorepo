import { Button, images } from '@wimet/apps-shared';
import styled from 'styled-components';
import { IconButton } from '../styles';

export const CustomButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkBlue};
  border: solid 0.11em ${({ theme }) => theme.colors.darkBlue};
  font-weight: 300;
  padding: 8px 12px;

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    color: ${({ theme }) => theme.colors.darkBlue};
    filter: saturate(1.5) brightness(94%);
  }

  &.survey-primary-button {
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
  }

  &.survey-secondary-button {
    background-color: ${({ theme }) => theme.colors.white};
  }

  &:disabled,
  &:disabled:hover,
  &:disabled:focus {
    color: ${({ theme }) => theme.colors.gray} !important;
    background-color: ${({ theme }) => theme.colors.lighterGray} !important;
  }
`;

export const CopyLinkIcon = styled(images.TinyDuplicate)`
  transform: scale(1.5);
`;

export const ChartIcon = styled(images.VerticalChartIcon)`
  transform: scale(1.2);
`;

export const FooterContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: 'space-between';
  column-gap: 12px;
`;

export const DeleteButton = styled(IconButton)`
  margin-left: auto;
  align-self: center;
  transform: scale(1.2);
`;
