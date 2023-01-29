import styled, { css } from 'styled-components';
import { BlueprintStatus, CollaboratorStatus, InvoiceStatus, LocationStatus, PlanStatus } from '../../utils';
import Badge from '../Badge';

type SpaceStatusProps = {
  variant: LocationStatus | BlueprintStatus | CollaboratorStatus | PlanStatus;
};

export const planStatusStyle = {
  [LocationStatus.IN_PROCESS]: css`
    background-color: ${({ theme }) => theme.colors.lightBlue};
    color: ${({ theme }) => theme.colors.darkBlue};
  `,
  [BlueprintStatus.PENDING]: css`
    background-color: ${({ theme }) => theme.colors.lightBlue};
    color: ${({ theme }) => theme.colors.darkBlue};
  `,
  [BlueprintStatus.DRAFT]: css`
    background-color: ${({ theme }) => theme.colors.lightOrange};
    color: ${({ theme }) => theme.colors.extraDarkBlue};
  `,
  [CollaboratorStatus.PENDING]: css`
    background-color: ${({ theme }) => theme.colors.lightBlue};
    color: ${({ theme }) => theme.colors.extraDarkBlue};
  `,
  [CollaboratorStatus.REGISTERED]: css`
    background-color: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.white};
  `,
  [PlanStatus.ACTIVE]: css`
    background-color: ${({ theme }) => theme.colors.orange};
    color: ${({ theme }) => theme.colors.white};
  `,
  [PlanStatus.PENDING]: css`
    background-color: ${({ theme }) => theme.colors.lightBlue};
    color: ${({ theme }) => theme.colors.extraDarkBlue};
  `,
  [PlanStatus.PAUSED]: css`
    background-color: ${({ theme }) => theme.colors.gray};
    color: ${({ theme }) => theme.colors.white};
  `,
  [InvoiceStatus.OVERDUE]: css`
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.white};
  `,
  [InvoiceStatus.PAYED]: css`
    background-color: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.white};
  `,
  [InvoiceStatus.PENDING]: css`
    background-color: ${({ theme }) => theme.colors.lightBlue};
    color: ${({ theme }) => theme.colors.extraDarkBlue};
  `,
};

const StyledWrapper = styled(Badge)<SpaceStatusProps>`
  padding: 6px 8px;
  align-self: center;
  background-color: ${({ theme }) => theme.colors.orange};
  ${({ variant }) => planStatusStyle[variant]}
`;

type StatusBadgeProps = {
  className?: string;
} & SpaceStatusProps;

const StatusBadge: React.FC<StatusBadgeProps> = ({ className, children, variant = LocationStatus.PUBLISHED }) => (
  <StyledWrapper className={className} variant={variant}>
    {children}
  </StyledWrapper>
);

export default StatusBadge;
