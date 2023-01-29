import { Collaborator, useGetMe, User } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';
import useCreatePlanUser from '../../../../../hooks/api/useCreatePlanUser';
import useGetClientCompanyPlans from '../../../../../hooks/api/useGetCompanyPlans';
import useGetPlanUsers from '../../../../../hooks/api/useGetPlanUsers';
import AddUsersModal from '../../../../AddUsersModal';
import CollaboratorsTable from '../../../../CollaboratorsTable';
import DeleteUserFromPlanModal from '../../../../DeleteUserFromPlanModal';

const StyledWrapper = styled.div`
  margin-top: 64px;
`;

type Props = {
  planId: number;
};

const CollaboratorsTab = ({ planId }: Props) => {
  const { data: userData } = useGetMe();
  const { data: plans = [] } = useGetClientCompanyPlans(Number(userData?.companies[0].id));
  const [showAddCollaboratorsModal, setShowAddCollaboratorsModal] = useState(false);
  const [deleteCollaboratorsModal, setDeleteCollaboratorsModal] = useState<{
    show: boolean;
    collaborator?: Collaborator;
  }>({ show: false });

  const { mutateAsync, isLoading } = useCreatePlanUser(planId);
  const { data = [] } = useGetPlanUsers(planId);
  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  const handleOnAddMembers = async (selectedUsers: User[]) => {
    await mutateAsync({ users: selectedUsers.map(c => Number(c.id)) });
    setShowAddCollaboratorsModal(false);
  };

  const handleDeleteMember = async (collaborator: Collaborator) =>
    setDeleteCollaboratorsModal({ show: true, collaborator });
  const handleCancelDeleteMember = () => setDeleteCollaboratorsModal({ show: false });

  return (
    <StyledWrapper>
      <FormikProvider value={formik}>
        <CollaboratorsTable
          plans={plans}
          collaborators={data as unknown as Collaborator[]}
          showFilters={false}
          onClickAddCollaborator={() => setShowAddCollaboratorsModal(true)}
          showPlanColumn={false}
          showStatusColumn={false}
          onClickDelete={handleDeleteMember}
          disableRolChange
          allowAdminDelete
        />
        {showAddCollaboratorsModal && (
          <AddUsersModal
            onClickClose={() => setShowAddCollaboratorsModal(false)}
            initialSelectedUsers={data}
            isLoading={isLoading}
            users={[]}
            onSave={handleOnAddMembers}
          />
        )}
        {deleteCollaboratorsModal.show && (
          <DeleteUserFromPlanModal
            selectedCollaborator={deleteCollaboratorsModal.collaborator}
            onClose={handleCancelDeleteMember}
            onCancel={handleCancelDeleteMember}
          />
        )}
      </FormikProvider>
    </StyledWrapper>
  );
};

export default CollaboratorsTab;
