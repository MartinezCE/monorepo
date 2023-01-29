import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BaseFilterSidebar, Collaborator, useGetMe, User } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import CollaboratorMainDataHeader from './CollaboratorMainDataHeader';
import { useGetCollaborator } from '../../../hooks/api/useGetCollaborator';
import CollaboratorsReservations from './CollaboratorsReservations';
import { ReservationSortByOptions } from './CollaboratorsReservations/CollaboratorsReservations';
import useGetUserReservations from '../../../hooks/api/useGetUserReservations';

const StyledSidebar = styled(BaseFilterSidebar)`
  min-width: 830px;
  & > div {
    margin-bottom: 16px;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 92px);
`;

export type CollaboratorsDetailSidebarInitialValues = {
  reservationType: ReservationSortByOptions;
};

type Props = {
  collaborator: Collaborator;
  onClose: () => void;
};

const CollaboratorsDetailSidebar = ({ onClose, collaborator }: Props) => {
  const router = useRouter();
  const { data: userData } = useGetMe();
  const collaboratorId = router.query.collaboratorId as string;

  const { data: selectedCollaborator = {} as Partial<Collaborator> } = useGetCollaborator(
    Number(userData?.companies?.[0]?.id),
    Number(collaboratorId)
  );
  const { data: userReservations = [] } = useGetUserReservations(collaboratorId);

  const formik = useFormik({
    initialValues: { reservationType: ReservationSortByOptions.WPM } as CollaboratorsDetailSidebarInitialValues,
    onSubmit: () => {},
  });

  return (
    <FormikProvider value={formik}>
      <StyledSidebar onClickClose={onClose}>
        <StyledWrapper>
          <CollaboratorMainDataHeader
            collaborator={selectedCollaborator as User}
            isRegistered={collaborator.isRegistered}
            email={collaborator.email}
          />
          <CollaboratorsReservations
            wpmReservations={selectedCollaborator.WPMReservations}
            spacesReservations={userReservations}
          />
        </StyledWrapper>
      </StyledSidebar>
    </FormikProvider>
  );
};

export default CollaboratorsDetailSidebar;
