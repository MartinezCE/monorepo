import React, { useMemo } from 'react';
import {
  Avatar,
  CollaboratorStatus,
  getCollaboratorStatusLabel,
  images,
  StatusBadge,
  Switch,
  User,
  UserRole,
  UserRoleLabels,
} from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import useGetUserPlan from '../../../../hooks/api/useGetUserPlan';
import useSwitchUsersWPM from '../../../../hooks/api/useSwitchUsersWPM';
import UsersTable from '../../../UsersTable/UsersTable';

const StyledMainDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
  border-radius: 8px;
`;

const StyledHeader = styled.div`
  display: flex;
`;
const StyledDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 32px;
  flex: 1;
`;

const StyledNameWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;
const StyledName = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledItemsWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  column-gap: 16px;
`;
const StyledItem = styled.div`
  display: flex;
  align-items: center;
`;

const IconStyles = css`
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledMailIcon = styled(images.Mail)`
  ${IconStyles}
  transform: scale(0.64);
  margin-left: -4px;
`;
const StyledStaffIcon = styled(images.Staff)`
  ${IconStyles}
  transform: scale(0.78);
`;

const DataText = css`
  font-size: 14px;
  font-weight: 200;
`;

const StyledItemText = styled.div`
  ${DataText}
  margin-left: 12px;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledJoinText = styled.div`
  ${DataText}
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledStatusBadge = styled(StatusBadge)`
  align-self: flex-start;
`;

const StyledPlanWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const ContainerOptionsWPM = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAccess = styled.div`
  width: 15em;
  justify-content: space-between;
  text-align: right;
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
  display: flex;
  align-items: center;
  & span {
    color: ${({ theme }) => theme.colors.blue};
    font-size: 14px;
    font-weight: 500;
    margin-left: 1em;
  }
`;
const StyledPlanCredits = styled.div`
  width: 15em;
`;
const StyledCreditsText = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: baseline;
  font-size: 24px;
  font-weight: 200;
  & span {
    font-weight: 500;
    font-size: 24px;
    color: ${({ theme }) => theme.colors.blue};
  }
`;
const StyledPlanText = styled.div`
  margin-top: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
`;
const StyledLabel = styled.div`
  font-size: 16px;
  margin-left: 8px;
`;

type Props = {
  collaborator: User;
  isRegistered?: boolean;
  email?: string;
};

const CollaboratorMainDataHeader = ({ collaborator, isRegistered, email }: Props) => {
  const { mutateAsync } = useSwitchUsersWPM(Number(collaborator?.companies?.[0].id));
  const collaboratorStatus = useMemo(
    () => (isRegistered ? CollaboratorStatus.REGISTERED : CollaboratorStatus.PENDING),
    [isRegistered]
  );

  const { data: planData } = useGetUserPlan();

  const handleSwitchChange = (newValue: boolean, id: number) => mutateAsync({ isWPMEnabled: newValue, users: [id] });

  return (
    <StyledMainDataWrapper>
      <StyledHeader>
        <Avatar image={collaborator.avatarUrl} variant='lighterGray' size={100} borderWidth={4} />
        <StyledDataWrapper>
          {collaborator.firstName && (
            <StyledNameWrapper>
              <StyledName>{`${collaborator.firstName} ${collaborator.lastName}`}</StyledName>
            </StyledNameWrapper>
          )}
          <StyledItemsWrapper>
            <StyledItem>
              <StyledMailIcon />
              <StyledItemText>{collaborator.email || email}</StyledItemText>
            </StyledItem>
            {!!collaborator.userRole?.id && (
              <StyledItem>
                <StyledStaffIcon />
                <StyledItemText>{UserRoleLabels[collaborator.userRole?.value]}</StyledItemText>
              </StyledItem>
            )}
          </StyledItemsWrapper>
          {!!collaborator.createdAt && (
            <StyledJoinText>
              Se unió en {format(new Date(collaborator.createdAt), 'LLLL, yyyy', { locale: es })}
            </StyledJoinText>
          )}
        </StyledDataWrapper>
        <StyledStatusBadge variant={collaboratorStatus}>
          {getCollaboratorStatusLabel(collaboratorStatus)}
        </StyledStatusBadge>
      </StyledHeader>
      <StyledPlanWrapper>
        <StyledPlanCredits>
          <StyledCreditsText>
            <span>{planData?.usedCredits}</span>
            <StyledLabel>créditos utilizados</StyledLabel>
          </StyledCreditsText>
          <StyledPlanText>{planData?.name}</StyledPlanText>
        </StyledPlanCredits>
        <ContainerOptionsWPM>
          <StyledAccess>
            <Switch
              disabled={collaborator.userRole?.value === UserRole.ACCOUNT_MANAGER}
              checked={collaborator.isWPMEnabled}
              onChange={() => handleSwitchChange(!collaborator.isWPMEnabled, collaborator.id as number)}
            />
            <span>Workplace Manager</span>
          </StyledAccess>
          <UsersTable userData={collaborator} />
        </ContainerOptionsWPM>
      </StyledPlanWrapper>
    </StyledMainDataWrapper>
  );
};

export default CollaboratorMainDataHeader;
