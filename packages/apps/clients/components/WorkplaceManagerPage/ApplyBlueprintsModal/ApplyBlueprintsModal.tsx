import React, { useMemo } from 'react';
import { CompanyBlueprint, Select, useGetMe, Blueprint } from '@wimet/apps-shared';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import useSetUsersBlueprints, { ApplyTo } from '../../../hooks/api/useSetUsersBlueprints';
import BlueprintsTable from './BlueprintsTable';
import ApplyBaseModal from '../ApplyBaseModal';

const StyledTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const StyledApplySelectWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 14px;
  width: fit-content;
`;

const applyToOptions: { value: ApplyTo; label: string }[] = [
  { value: ApplyTo.USER, label: 'Usuario' },
  { value: ApplyTo.ALL, label: 'Todos' },
  // { value: ApplyTo.TEAM, label: 'Equipo Ventas' },
];

const initialValues: {
  applyTo: ApplyTo;
  blueprints: { [k: string]: { id: number; amenities: { value: number; label: string }[] } };
} = { applyTo: ApplyTo.USER, blueprints: {} };

export type BlueprintsAccess = typeof initialValues;

type Props = {
  selectedUserId: number;
  companyBlueprints: Blueprint[];
  initialSelectedBlueprints?: Blueprint[];
  onClickClose: () => void;
  onClickBack: () => void;
  onClickSave?: (selectedBlueprints: CompanyBlueprint[]) => void;
};

const ApplyBlueprintsModal = ({
  selectedUserId,
  companyBlueprints,
  initialSelectedBlueprints,
  onClickSave,
  onClickClose,
  onClickBack,
}: Props) => {
  const { data: userData } = useGetMe();
  const { mutateAsync, isLoading } = useSetUsersBlueprints(Number(userData?.companies?.[0]?.id), {
    onSuccess: res => {
      onClickSave?.(res);
      onClickClose();
    },
  });
  const selectedBlueprints = useMemo(() => {
    if (!companyBlueprints.length) return {};
    return (
      initialSelectedBlueprints?.reduce((acc, el) => {
        acc[el.id] = { id: el.id, amenities: el.amenities?.map(a => ({ value: a.id, label: a.name })) || [] };
        return acc;
      }, {} as BlueprintsAccess['blueprints']) || {}
    );
  }, [companyBlueprints.length, initialSelectedBlueprints]);

  const formik = useFormik({
    initialValues: { ...initialValues, blueprints: selectedBlueprints } as BlueprintsAccess,
    enableReinitialize: true,
    onSubmit: async ({ applyTo, blueprints }) => {
      await mutateAsync({
        to: applyTo,
        userId: selectedUserId,
        // teamId: -1,
        blueprints: Object.values(blueprints).map(({ id, amenities }) => ({
          id,
          amenityIds: amenities.map(a => a.value),
        })),
      });
    },
  });

  return (
    <FormikProvider value={formik}>
      <ApplyBaseModal
        selectedCount={Object.keys(formik.values.blueprints).length}
        isLoading={isLoading}
        onClickClose={onClickClose}
        onClickBack={onClickBack}
        onClickSave={() => formik.handleSubmit()}>
        <StyledTableWrapper>
          <BlueprintsTable companyBlueprints={companyBlueprints} />
        </StyledTableWrapper>
        <StyledApplySelectWrapper>
          <Select
            options={applyToOptions}
            instanceId='applyToOptions'
            placeholder=''
            prefix='Aplicar a:'
            name='applyTo'
            variant='secondary'
          />
        </StyledApplySelectWrapper>
      </ApplyBaseModal>
    </FormikProvider>
  );
};

export default ApplyBlueprintsModal;
