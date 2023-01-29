/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Collaborator,
  getUserRoleLabels,
  images,
  useGetMe,
  UserRole,
  Select,
  getUserRoleDescriptionLabels,
} from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CollaboratorsDetailSidebar from '../../components/CollaboratorsPage/CollaboratorsDetailSidebar';
import CollaboratorsHeader from '../../components/CollaboratorsPage/CollaboratorsHeader';
import CreateCollaboratorsModal from '../../components/CollaboratorsPage/CreateCollaboratorsModal';
import ConfirmModal from '../../components/CollaboratorsPage/CreateCollaboratorsModal/ConfirmModal';
import CustomTable from '../../components/CustomTable';
import { TypeData } from '../../components/CustomTable/CustomTableRow';
import DeleteCollaboratorModal from '../../components/DeleteCollaboratorModal';
import Layout from '../../components/Layout';
import { useGetCollaborators } from '../../hooks/api/useGetCollaborators';
import useSetCollaboratorRole from '../../hooks/api/useSetCollaboratorRole';
import { SelectRoles } from '../../types/api';

const StyledWrapper = styled.div`
  padding-top: 64px;
  padding-left: 75px;
  padding-bottom: 64px;
  width: 100%;
`;

const ROLE_OPTIONS = [
  {
    label: getUserRoleLabels(UserRole.ACCOUNT_MANAGER),
    value: 1,
    description: getUserRoleDescriptionLabels(UserRole.ACCOUNT_MANAGER),
  },
  {
    label: getUserRoleLabels(UserRole.TEAM_MANAGER),
    value: 2,
    description: getUserRoleDescriptionLabels(UserRole.TEAM_MANAGER),
  },
  {
    label: getUserRoleLabels(UserRole.MEMBER),
    value: 3,
    description: getUserRoleDescriptionLabels(UserRole.MEMBER),
  },
];

const CollaboratorsPage = () => {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateConfirmModal, setShowCreateConfirmModal] = useState(false);
  const [deleteCollaboratorsModal, setDeleteCollaboratorsModal] = useState<{
    show: boolean;
    collaborator?: Collaborator;
  }>({ show: false });

  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const collaboratorId = router.query.collaboratorId as string;
  const { data: userData } = useGetMe();
  const { data: collaborators = [] } = useGetCollaborators(Number(userData?.companies[0].id));
  const { mutateAsync: updateRole } = useSetCollaboratorRole();

  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  useEffect(() => {
    if (collaboratorId) {
      const collaborator = collaborators.find(c => c.id === parseInt(collaboratorId, 10)) || null;
      setSelectedCollaborator(collaborator);
    }
  }, [collaboratorId, collaborators]);

  const handleOnSubmit = () => {
    setShowCreateConfirmModal(true);
    setShowCreateModal(false);
  };

  const handleOnClose = () => {
    setSelectedCollaborator(null);
    router.push('/company/collaborators');
  };

  const handleDeleteCollaborator = async (collaborator: Collaborator) =>
    setDeleteCollaboratorsModal({ show: true, collaborator });
  const handleCancelDeleteCollaborator = () => setDeleteCollaboratorsModal({ show: false });

  const handleChange = (rol: SelectRoles, user: Collaborator) => {
    updateRole({
      userRoleId: rol?.value,
      userId: user.id,
    });
  };

  const parsedUsersForTable = useMemo(
    () =>
      collaborators?.map((user, i) => [
        { variant: 'avatar', title: user.firstName ? `${user.firstName} ${user.lastName}` : '-', subtitle: user.email },
        { variant: 'text', text: user.companyRole || '-' },
        {
          variant: 'custom',
          children: (
            <Select
              onChange={rol => {
                handleChange(rol as SelectRoles, user);
              }}
              variant='secondary'
              options={ROLE_OPTIONS}
              placeholder={getUserRoleLabels(UserRole[user.userRole])}
              instanceId='sortOptions'
              name={`row[${i}].sortBy`}
              isDisabled={!user.isRegistered}
              alignMenu='center'
            />
          ),
        },
        { variant: 'text', text: user.planName ? user.planName : '-' },
        {
          variant: 'chip',
          text: user.isRegistered ? 'Registrado' : 'No registrado',
          type: user.isRegistered ? 'success' : 'danger',
        },
        {
          variant: 'custom',
          children: (
            <Button
              variant='transparent'
              leadingIcon={<images.TinyBin />}
              onClick={e => {
                e.stopPropagation();
                handleDeleteCollaborator(user);
              }}
            />
          ),
        },
      ]) as unknown as TypeData[][],
    [collaborators]
  );

  return (
    <Layout>
      <FormikProvider value={formik}>
        <StyledWrapper>
          <CollaboratorsHeader onClickCreate={() => setShowCreateModal(true)} />
          <CustomTable
            headers={['Nombre', 'Rol', 'Usuario', 'Equipo', 'Estado', 'Acción']}
            data={parsedUsersForTable}
          />
        </StyledWrapper>
      </FormikProvider>
      {showCreateModal && (
        <CreateCollaboratorsModal onSubmit={handleOnSubmit} onClickClose={() => setShowCreateModal(false)} />
      )}
      {showCreateConfirmModal && <ConfirmModal onClickClose={() => setShowCreateConfirmModal(false)} />}
      {selectedCollaborator && (
        <CollaboratorsDetailSidebar collaborator={selectedCollaborator} onClose={handleOnClose} />
      )}
      {deleteCollaboratorsModal.show && (
        <DeleteCollaboratorModal
          selectedCollaborator={deleteCollaboratorsModal.collaborator}
          onClose={handleCancelDeleteCollaborator}
          onCancel={handleCancelDeleteCollaborator}
        />
      )}
    </Layout>
  );
};

export default CollaboratorsPage;
