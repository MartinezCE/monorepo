import {
  PlanStatus,
  planStatusLabels,
  PlanTypes,
  pluralize,
  planTypesLabels,
  Select,
  planStatusStyle,
} from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import React, { ComponentPropsWithoutRef } from 'react';
import styled, { css } from 'styled-components';
import useUpdatePlan from '../../../../../hooks/api/useUpdatePlan';
import type { PlanStatusProps } from '../CreatedPlanCard';

export const disabledConfig = css<PlanStatusProps>`
  ${({ theme, status }) => status === PlanStatus.PAUSED && `color: ${theme.colors.gray}`};
`;

const backgroundConfig = {
  [PlanStatus.ACTIVE]: css`
    background-color: ${({ theme }) => theme.colors.lightBlue};
  `,
  [PlanStatus.PENDING]: css`
    background-color: ${({ theme }) => theme.colors.extraLightBlue};
  `,
  [PlanStatus.PAUSED]: css`
    background-color: ${({ theme }) => theme.colors.lighterGray};
  `,
};

const textConfig = {
  [PlanStatus.ACTIVE]: css`
    color: ${({ theme }) => theme.colors.white} !important;
  `,
  [PlanStatus.PENDING]: css`
    color: ${({ theme }) => theme.colors.darkGray} !important;
  `,
  [PlanStatus.PAUSED]: css`
    color: ${({ theme }) => theme.colors.lighterGray}!important;
  `,
};

const StyledHeaderWrapper = styled.div<PlanStatusProps>`
  position: relative;
  border-radius: 8px 8px 0px 0px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  ${({ status }) => backgroundConfig[status]};
`;

const StyledTypeText = styled.div<PlanStatusProps>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.blue};
  ${disabledConfig};
`;

const StyledNameText = styled.div<PlanStatusProps>`
  margin-top: 8px;
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkBlue};
  ${disabledConfig};
`;

const StyledCollaboratorsText = styled.div<PlanStatusProps>`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 200;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 18px;
  ${disabledConfig};
`;

const StyledSelectWrapper = styled.div``;

const PLAN_TYPES = [
  {
    value: PlanStatus.PENDING,
    label: planStatusLabels[PlanStatus.PENDING],
    disabled: true,
  },
  {
    value: PlanStatus.ACTIVE,
    label: planStatusLabels[PlanStatus.ACTIVE],
    disabled: false,
  },
  {
    value: PlanStatus.PAUSED,
    label: planStatusLabels[PlanStatus.PAUSED],
    disabled: false,
  },
];

const StyledSelect = styled(Select)<{ status: PlanStatus }>`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 100px;
  border-radius: 4px;
  padding: 8px;

  ${({ status }) => planStatusStyle[status]}

  & > div > div > div > div {
    ${({ status }) => textConfig[status]}
  }
  & .react-select__indicators {
    ${({ status }) => textConfig[status]}
  }
`;

type Props = ComponentPropsWithoutRef<'div'> & {
  status: PlanStatus;
  type: PlanTypes;
  name: string;
  collaboratorsCount: number;
  planId: number;
};

const CreatedPlanCardHeader = ({ status, type, name, collaboratorsCount, planId, ...props }: Props) => {
  const formik = useFormik({
    initialValues: { status },
    onSubmit: () => {},
  });

  const { mutateAsync } = useUpdatePlan(planId);

  const handleUpdateStatus = async ({ value }: typeof PLAN_TYPES[number]) => {
    formik.setFieldValue('status', value);
    await mutateAsync({ status: value });
  };
  return (
    <StyledHeaderWrapper status={status} {...props}>
      <FormikProvider value={formik}>
        <StyledTypeText status={status}>{planTypesLabels[type]}</StyledTypeText>
        <StyledNameText status={status}>{name}</StyledNameText>
        <StyledCollaboratorsText status={status}>
          {`${pluralize(collaboratorsCount, 'colaborador', true)}`}
        </StyledCollaboratorsText>
        <StyledSelectWrapper onClick={e => e.stopPropagation()}>
          <StyledSelect
            isOptionDisabled={option => (option as typeof PLAN_TYPES[number]).disabled}
            status={formik.values.status}
            options={PLAN_TYPES}
            instanceId='statusOptions'
            onChange={handleUpdateStatus as never}
            name='status'
            variant='secondary'
          />
        </StyledSelectWrapper>
      </FormikProvider>
      {/* <StyledStatusBadge variant={status}>{planStatusLabels[status]}</StyledStatusBadge> */}
    </StyledHeaderWrapper>
  );
};

export default CreatedPlanCardHeader;
