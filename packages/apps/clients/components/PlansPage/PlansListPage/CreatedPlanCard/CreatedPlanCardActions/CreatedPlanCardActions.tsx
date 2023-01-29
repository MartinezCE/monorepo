import React from 'react';
import { Button, images, PlanStatus } from '@wimet/apps-shared';
import { ButtonIconBinMixin, ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import styled from 'styled-components';

const StyledActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;
const StyledMainActionsWrapper = styled.div`
  display: flex;
`;

const StyledButtonIcon = styled(Button)`
  ${ButtonIconMixin};
`;

const StyledButtonIconBin = styled(StyledButtonIcon)`
  ${ButtonIconBinMixin};
  margin-left: 16px;
`;

const StyledActivatePlanButton = styled(Button)`
  color: ${({ theme }) => theme.colors.blue};
`;

type Props = {
  status: PlanStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  disabledDelete?: boolean;
};

const CreatedPlanCardActions = ({ status, onActivate, onDelete, onEdit, disabledDelete }: Props) => (
  <StyledActionsWrapper>
    <StyledMainActionsWrapper>
      <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyEdit />} onClick={onEdit} />
      <StyledButtonIconBin
        variant='secondary'
        leadingIcon={<images.TinyBin />}
        onClick={onDelete}
        disabled={disabledDelete}
      />
    </StyledMainActionsWrapper>
    {status === PlanStatus.PAUSED && (
      <StyledActivatePlanButton variant='transparent' onClick={onActivate}>
        Activar plan
      </StyledActivatePlanButton>
    )}
  </StyledActionsWrapper>
);

export default CreatedPlanCardActions;
