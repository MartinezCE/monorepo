/* eslint-disable no-extra-boolean-cast */
import { Button, EmptyState, useGetMe, User, UserStatus, images, Input } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import AddUsersModal from '../../../../components/AddUsersModal';
import CustomTable from '../../../../components/CustomTable';
import { TypeData } from '../../../../components/CustomTable/CustomTableRow';
import TeamPageLayout from '../../../../components/TeamsPage/TeamPageLayout';
import useCreatePlanUser from '../../../../hooks/api/useCreatePlanUser';
import useDeletePlanUser from '../../../../hooks/api/useDeletePlanUser';
import { useGetCompanyUsers } from '../../../../hooks/api/useGetCompanyUsers';
import useGetPlanUsers from '../../../../hooks/api/useGetPlanUsers';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -1em;
  margin-bottom: 3em;

  .add-collaborators-input-search {
    width: 300px;
  }

  .add-collaborators-btn {
    margin-left: auto;

    span {
      font-size: 1.8em;
      font-weight: 400;
      color: inherit;
    }
  }
`;

const TeamsCollaboratorsPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const { data: user } = useGetMe();

  const formik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: () => {},
  });

  const { data: planCollaborators = [] } = useGetPlanUsers(teamId as string);
  const { data: companyUsers = [] } = useGetCompanyUsers(Number(user?.companies?.[0]?.id), { havePlans: false });
  const { mutateAsync: deleteCollaboratorFromPlan } = useDeletePlanUser();
  const { mutateAsync: associateUsersToPlan, isLoading: associatingUsers } = useCreatePlanUser(Number(teamId));

  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState<boolean>(false);

  const usersWhithoutPlan = useMemo(
    () => companyUsers.filter(us => !planCollaborators.find(u => u.id === us.id)),
    [companyUsers, planCollaborators]
  );

  // no tiene colaboradores sin equipo asociado

  const handleSave = async (res: User[]) => {
    if (res) {
      const payload = { users: res.map(r => r.id) };
      await associateUsersToPlan(payload);
      toast.success('Colaboradores adheridos con éxito al equipo');
    }
    setShowAddCollaboratorModal(false);
  };

  const handleSearch = (us: User, searchValue: string) =>
    `${us.firstName}${us.email}`.toLowerCase().includes(searchValue.toLocaleLowerCase());

  const parsedUsersForTable = useMemo(
    () =>
      planCollaborators
        ?.filter(us => handleSearch(us, formik.values.search))
        .map(us => [
          { variant: 'avatar', title: `${us.firstName} ${us.lastName}`, subtitle: us.email },
          {
            variant: 'chip',
            text: us.status === UserStatus.APPROVED ? 'Activo' : 'Pendiente',
            type: us.status === UserStatus.APPROVED ? 'success' : 'danger',
          },
          {
            variant: 'custom',
            children: (
              <Button
                variant='transparent'
                leadingIcon={<images.TinyBin />}
                onClick={async e => {
                  try {
                    e.stopPropagation();
                    await deleteCollaboratorFromPlan({ userId: us.id, planId: Number(teamId) });
                    toast.success(`Colaborador ${us.firstName} eliminado del equipo con éxito`);
                  } catch (error) {
                    toast.error(error as Error);
                  }
                }}
              />
            ),
          },
        ]) as unknown as TypeData[][],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teamId, planCollaborators, formik.values.search]
  );

  return (
    <div>
      <FormikProvider value={formik}>
        <HeaderWrapper>
          {!!planCollaborators.length && (
            <Input
              className='add-collaborators-input-search'
              placeholder='Buscar por nombre o por mail'
              name='search'
            />
          )}
          <Button className='add-collaborators-btn' onClick={() => setShowAddCollaboratorModal(true)}>
            <span>+</span> Agregar colaboradores
          </Button>
        </HeaderWrapper>
      </FormikProvider>

      {!!parsedUsersForTable.length ? (
        <CustomTable headers={['Nombre', 'Estado', 'Acciones']} data={parsedUsersForTable} />
      ) : (
        <EmptyState
          title={
            !formik.values.search
              ? 'Aún no tienes colaboradores en este equipo'
              : 'No se encontraron resultados de su búsqueda'
          }
          subtitle={
            !formik.values.search ? 'Podrás ver las reservas de tus colaboradores con información básica y estado.' : ''
          }
        />
      )}

      {showAddCollaboratorModal && (
        <AddUsersModal
          title='Agregar colaboradores'
          users={usersWhithoutPlan}
          isLoading={associatingUsers}
          onClickClose={() => setShowAddCollaboratorModal(false)}
          onSave={handleSave}
          emptyState={{
            subtitle: 'Todos sus colaboradores ya pertenecen a un equipo',
          }}
        />
      )}
    </div>
  );
};

TeamsCollaboratorsPage.getLayout = (page: React.ReactElement) => <TeamPageLayout>{page}</TeamPageLayout>;

export default TeamsCollaboratorsPage;
