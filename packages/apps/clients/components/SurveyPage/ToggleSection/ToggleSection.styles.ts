import { images } from '@wimet/apps-shared';
import styled from 'styled-components';

export const ToggleWrapper = styled.div`
  > div {
    cursor: pointer;
    border-top: solid ${({ theme }) => theme.colors.black} 1px;
  }

  > div:last-child {
    border-bottom: solid ${({ theme }) => theme.colors.black} 1px;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  column-gap: 20px;
  padding: 36px 0;

  .toggle-text {
    font-size: 26px;
    font-weight: 500;
  }
`;

export const ChevronIcon = styled(images.ChevronDown)`
  transform: scale(1.4);
  transition: transform 0.4s ease-in-out;

  &.chevron-up {
    transform: scale(1.4) rotate(180deg);
  }
`;

export const ContentWrapper = styled.div`
  max-height: 0;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0, 1, 0, 1);

  &.toggle-content-expanded {
    max-height: 100000px;
    padding: 20px 0;
    overflow: scroll;
    transition: all 0.8s ease-in-out;
  }
`;
