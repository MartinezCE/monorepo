/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-extra-boolean-cast */
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  Button,
  HeaderHero,
  Input,
  Modal,
  Select,
  images,
  useGetCountries,
  useGetMe,
  LoadingSpinner,
  PlanStatus,
  EmptyState,
} from '@wimet/apps-shared';
import { FormikProvider, Form, useFormik } from 'formik';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { TypeData } from '../../components/CustomTable/CustomTableRow';
import useGetCompanyTeams from '../../hooks/api/useGetCompanyTeams';
import { Layout, LayoutWrapper } from '../../components';
import banner from '../../public/images/image_locations.png';
import useCreateCompanyTeam from '../../hooks/api/useCreateCompanyTeam';
import CustomTable from '../../components/CustomTable';
import useDeletePlan from '../../hooks/api/useDeletePlan';

type TeamTableType = { name: any; collaborators: any; planCredit: { value: any }; status: PlanStatus; id: string };

const ModalWrapper = styled.div`
  min-width: 500px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 30px;
  padding: 60px 30px;
`;

const ConfirmationTitle = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5em;
  p {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 700;
    font-size: 1.5em;
  }
`;

const ConfirmationDescription = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 300;
  font-size: 1.1em;
  max-width: 80%;
  margin-bottom: 60px;
`;

const StyleCheckdIcon = styled(images.Checkmark)`
  transform: scale(1);
  color: ${({ theme }) => theme.colors.success};
`;

const ContentWrapper = styled.div`
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .create-team-button {
    margin-left: auto;
  }
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: 700;
  align-self: flex-start;
`;

const StyleInput = styled(Input)`
  width: 100%;
  margin-bottom: 8px;
  > label {
    text-align: initial;
  }
`;

const StyleSelect = styled(Select)`
  width: 100%;
  > * {
    text-align: initial;
  }
`;

const ActionBtnWrapper = styled.div`
  display: flex;
  column-gap: 20px;
  margin-left: auto;
`;

const PlusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
`;

const StyleHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.span`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  margin-bottom: 1rem;
`;

const StyleSubTitle = styled.span`
  font-weight: 400;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
`;

const StyleSearch = styled(Input)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgb(16 24 40 / 5%);
  border-radius: 8px;
  width: 25rem;
  margin-top: 2rem;
`;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Este campo es obligatorio')
    .min(2, 'El nombre debe contener al menos 2 carácteres'),
  countryId: Yup.number().typeError('Este campo es obligatorio'),
});

export default function TeamsPage() {
  const router = useRouter();

  const { data: user } = useGetMe();
  const { data: teams = [] } = useGetCompanyTeams(user?.companies[0].id as number, {
    enabled: user?.companies[0].id !== undefined,
  });
  const { data: countries } = useGetCountries({
    select: item =>
      item.map(val => ({
        ...val,
        label: val.name,
        value: val.id,
      })),
  });
  const { mutateAsync: createTeam, isLoading: creatingTeam } = useCreateCompanyTeam(user?.companies[0].id as number);
  const { mutateAsync: deleteTeam, isLoading: deletingTeam } = useDeletePlan();

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const searchFormik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: () => {},
  });

  const createTeamFormik = useFormik({
    initialValues: {
      name: '',
      countryId: null,
    },
    validationSchema,
    onSubmit: async values => {
      const team = await createTeam(values);
      setShowTeamModal(false);
      createTeamFormik.resetForm();
      setShowConfirmationModal(true);

      await new Promise<void>(resolve => {
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          resolve();
        }, 3000);
      });

      router.push(`/teams/${team.id}/collaborators`);
    },
  });

  const onClickTeam = (teamId: string) => router.push(`/teams/${teamId}/general`);

  const onDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam({ planId: teamId });
      toast.success('Equipo eliminado con éxito');
    } catch (error) {
      toast.error(error as Error);
    }
  };

  const parsedTeamsForTable = useMemo(
    () =>
      teams
        ?.filter((t: TeamTableType) => t.name.toLowerCase().includes(searchFormik.values.search.toLocaleLowerCase()))
        .map((t: TeamTableType) => [
          { variant: 'avatar', title: t.name },
          { variant: 'text', text: t.collaborators },
          { variant: 'text', text: t?.planCredit?.value || 0 },
          {
            variant: 'chip',
            text: t.status === PlanStatus.ACTIVE ? 'Activo' : 'Pendiente',
            type: t.status === PlanStatus.ACTIVE ? 'success' : 'danger',
          },
          {
            variant: 'custom',
            children: (
              <ActionBtnWrapper>
                <Button
                  disabled={deletingTeam}
                  variant='transparent'
                  leadingIcon={<images.TinyEdit />}
                  onClick={() => onClickTeam(t.id)}
                />
                <Button
                  disabled={deletingTeam}
                  variant='transparent'
                  leadingIcon={<images.TinyBin />}
                  onClick={() => onDeleteTeam(t.id)}
                />
              </ActionBtnWrapper>
            ),
          },
        ]) as unknown as TypeData[][],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teams, teams.length, deletingTeam, searchFormik.values.search]
  );

  const handleCloseTeamModal = () => {
    setShowTeamModal(false);
    createTeamFormik.resetForm();
  };

  const title = (
    <>
      La libertad de poder trabajar <br /> desde cualquier lugar
    </>
  );

  const description = (
    <>
      Conoce los beneficios de tener Wimet <br /> para tu equipo y cómo funciona.
    </>
  );

  return (
    <Layout>
      <LayoutWrapper>
        {!teams.length && (
          <HeaderHero
            title={title}
            description={description}
            banner={banner}
            handleClick={() => setShowTeamModal(true)}
          />
        )}
        <ContentWrapper>
          <div className='header-wrapper'>
            <StyleHeaderTitle>
              <StyledTitle>Equipos</StyledTitle>
              <StyleSubTitle>Define y edita quién puede sentarse en cada zona.</StyleSubTitle>
            </StyleHeaderTitle>
            <Button
              className='create-team-button'
              onClick={() => setShowTeamModal(true)}
              leadingIcon={<PlusIcon>+</PlusIcon>}>
              {!teams.length ? 'Crear un equipo' : 'Nuevo equipo'}
            </Button>
          </div>
          <FormikProvider value={searchFormik}>
            {!!teams.length && <StyleSearch placeholder='Buscar por nombre de equipo' name='search' />}
          </FormikProvider>
          {!!parsedTeamsForTable.length ? (
            <CustomTable
              headers={['Equipo', 'Colaboradores', 'Créditos', 'Status', 'Acciones']}
              data={parsedTeamsForTable}
            />
          ) : (
            <EmptyState
              title={!searchFormik.values.search ? 'Aún no has no tienes equipos' : ''}
              subtitle={
                searchFormik.values.search
                  ? 'No se encontraron resultados de su búsqueda'
                  : 'Crea tu primer equipo para comenzar'
              }
            />
          )}
        </ContentWrapper>
        {showTeamModal && (
          <Modal variant='light' onClose={handleCloseTeamModal}>
            <FormikProvider value={createTeamFormik}>
              <Form>
                <ModalWrapper>
                  <Title>Crear equipo</Title>
                  <StyleInput
                    label='Nombre de equipo'
                    placeholder='Define un nombre para este equipo'
                    type='string'
                    name='name'
                  />
                  <StyleSelect
                    label='País'
                    options={countries}
                    instanceId='teamCountryOptions'
                    name='countryId'
                    placeholder='Selecciona un pais'
                  />
                  <ActionBtnWrapper>
                    <Button variant='outline' onClick={handleCloseTeamModal}>
                      Cancelar
                    </Button>
                    <Button
                      variant='primary'
                      type='submit'
                      disabled={!createTeamFormik.values.name || !createTeamFormik.values.countryId || creatingTeam}>
                      {creatingTeam && <LoadingSpinner />}
                      Crear
                    </Button>
                  </ActionBtnWrapper>
                </ModalWrapper>
              </Form>
            </FormikProvider>
          </Modal>
        )}
        {showConfirmationModal && (
          <Modal showCloseButton={false}>
            <ModalWrapper>
              <StyleCheckdIcon />
              <ConfirmationTitle>
                <p>¡Listo!</p>
                <p>Tu equipo ha sido creado con éxito</p>
              </ConfirmationTitle>
              <ConfirmationDescription>
                Recuerda incluir como miembros del equipo a los colaboradores que decidas, establecer límites de
                presupuesto y reglas de uso para este equipo.
              </ConfirmationDescription>
            </ModalWrapper>
          </Modal>
        )}
      </LayoutWrapper>
    </Layout>
  );
}
