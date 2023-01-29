import React, { useMemo } from 'react';
import { CompanyBlueprint, useGetMe, Blueprint } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import AmenitiesTable from '../ApplyBlueprintsModal/AmenitiesTable';
import ApplyBaseModal from '../ApplyBaseModal';
import useGetSeatAmenities from '../../../hooks/api/useGetSeatAmenities';
import useSetUsersAmenities from '../../../hooks/api/useSetUsersAmenities';

const StyledTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const initialValues: { amenities: { id: number }[] } = { amenities: [] };

export type AmenitiesAccess = typeof initialValues;

type Props = {
  selectedUserId: number;
  companyBlueprints: Blueprint[];
  initialSelectedBlueprints?: Blueprint[];
  onClickClose: () => void;
  onClickBack: () => void;
  onClickSave?: (selectedBlueprints: CompanyBlueprint[]) => void;
};

const ApplyAmenitiesModal = ({
  selectedUserId,
  companyBlueprints,
  initialSelectedBlueprints,
  onClickSave,
  onClickClose,
  onClickBack,
}: Props) => {
  const { data: userData } = useGetMe();
  const { data: companyAmenities = [] } = useGetSeatAmenities(Number(userData?.companies?.[0]?.id));
  const { mutateAsync, isLoading } = useSetUsersAmenities(Number(userData?.companies?.[0]?.id), {
    onSuccess: res => {
      onClickSave?.(res);
      onClickClose();
    },
  });
  const initialAmenities = useMemo(() => {
    if (!companyBlueprints.length) return [];
    const amenities = companyAmenities.filter(el =>
      el.blueprints?.every(b =>
        initialSelectedBlueprints?.some(s => s.id === b.id && s.amenities?.some(a => a.id === el.id))
      )
    );
    return amenities.map(el => ({ id: el.id }));
  }, [companyAmenities, companyBlueprints.length, initialSelectedBlueprints]);

  const formik = useFormik({
    initialValues: { amenities: initialAmenities } as AmenitiesAccess,
    enableReinitialize: true,
    onSubmit: async ({ amenities }) => mutateAsync({ userId: selectedUserId, amenityIds: amenities.map(el => el.id) }),
  });

  return (
    <FormikProvider value={formik}>
      <ApplyBaseModal
        selectedCount={Object.keys(formik.values.amenities).length}
        isLoading={isLoading}
        onClickClose={onClickClose}
        onClickBack={onClickBack}
        onClickSave={() => formik.handleSubmit()}>
        <StyledTableWrapper>
          <AmenitiesTable companyAmenities={companyAmenities} companyBlueprints={companyBlueprints} />
        </StyledTableWrapper>
      </ApplyBaseModal>
    </FormikProvider>
  );
};

export default ApplyAmenitiesModal;
