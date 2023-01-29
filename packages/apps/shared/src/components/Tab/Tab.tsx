import styled, { css } from 'styled-components';
import { TabItem } from '../../types';
import Button from '../Button';

type StyledWrapperProps = {
  variant?: TabVariant;
};
const StyledWrapper = styled.div<StyledWrapperProps>`
  ${({ variant }) => {
    switch (variant) {
      case 'filled':
        return css`
          width: 340px;
          height: 64px;
          border: 10px solid ${({ theme }) => theme.colors.blue};
          display: flex;
          column-gap: 6px;
          background-color: ${({ theme }) => theme.colors.blue};
          border-radius: 999px;
          overflow: hidden;

          @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
            width: 100%;
            max-width: 370px;
            height: 48px;
            border: 8px solid ${({ theme }) => theme.colors.blue};
          }
        `;
      case 'outline':
        return css`
          width: 100%;
          display: flex;
          & button {
            margin-right: 48px;
          }
        `;
      default:
        return '';
    }
  }};
`;

type StyledButtonProps = {
  selected?: boolean;
  tabVariant?: TabVariant;
};

const StyledButton = styled(Button)<StyledButtonProps>`
  ${({ selected, tabVariant }) => {
    switch (tabVariant) {
      case 'filled':
        return css`
          flex: 1;
          justify-content: center;
          ${selected &&
          css`
            background-color: ${({ theme }) => theme.colors.mediumLightBlue};

            &:hover,
            &:focus {
              background-color: ${({ theme }) => theme.colors.mediumLightBlue};
            }
          `}
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${({ theme }) => theme.colors.gray};
          font-weight: 200;
          font-size: 14px;
          border-bottom: 2px solid transparent};
          padding-left: 8.5px;
          padding-right: 8.5px;
          padding-top: 0;
          padding-bottom: 8;
          border-radius: 0;
          &:hover {
            border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
          }
          ${
            selected &&
            css`
              font-weight: 500;
              color: ${({ theme }) => theme.colors.blue};
              border-bottom: 2px solid ${({ theme }) => theme.colors.blue};
              &:hover {
                &:hover {
                  border-bottom: 2px solid ${({ theme }) => theme.colors.blue};
                }
              }
            `
          }
          &:hover, &:focus {
            background-color: transparent;
          }

        `;

      default:
        return '';
    }
  }};
`;

export type TabVariant = 'outline' | 'filled';

type TabProps = {
  tabs: TabItem[];
  active: TabItem;
  className?: string;
  variant?: TabVariant;
  onChange: (newActive: TabItem) => void;
};

export default function Tab({ tabs, active, className, onChange, variant = 'filled' }: TabProps) {
  return (
    <StyledWrapper className={className} variant={variant}>
      {tabs.map(tab => (
        <StyledButton
          tabVariant={variant}
          key={tab.id}
          variant='fifth'
          selected={active.id === tab.id}
          onClick={() => onChange(tab)}>
          {tab.label}
        </StyledButton>
      ))}
    </StyledWrapper>
  );
}
