/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Button,
  SpaceTypeEnum,
  spaceTypeFilterLabels,
  images,
  LoadingSpinner,
  Modal,
  useGetMe,
  UserRole,
  getUserRoleLabels,
  UserStatus,
} from '@wimet/apps-shared';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import { toast } from 'react-toastify';
import { useUpdateBlueprint } from '../../../../../../hooks/api/useUpdateBlueprint';
import CustomTable from '../../../../../../components/CustomTable';
import FileUploader, { FileUploaderWrapper } from '../../../../../../components/FileUploader';
import GoBackTitle from '../../../../../../components/GoBackTitle';
import Layout from '../../../../../../components/Layout';
import LayoutWrapper from '../../../../../../components/LayoutWrapper';
import useFilterOptions from '../../../../../../components/WorkplaceManagerPage/SelectSeatsSection/useFilterOptions';
import { useGetSeats } from '../../../../../../hooks/api/useGetSeats';
import AddUsersModal from '../../../../../../components/AddUsersModal';
import { useGetCompanyUsers } from '../../../../../../hooks/api/useGetCompanyUsers';
import useSetUsersBlueprints from '../../../../../../hooks/api/useBlueprintUsers';
import useGetUsersBlueprint from '../../../../../../hooks/api/useGetUsersBlueprint';
import { TypeData } from '../../../../../../components/CustomTable/CustomTableRow';
import useDeleteUserBlueprint from '../../../../../../hooks/api/useDeleteUserBlueprint';
import CustomTabs from '../../../../../../components/CustomTabs';

const ActionsSeats = styled.div`
  .disable {
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
  }
  .enable {
    font-size: 16px;
    font-weight: bold;
    margin: 0 2em;
    border-bottom: 2px solid ${({ theme }) => theme.colors.black};
    cursor: pointer;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FileUploaderInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;

const BlueprintImageContainer = styled.div`
  min-width: 250px;
  min-height: 120px;
  padding: 20px 30px;
  align-self: flex-start;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: space-between;
  column-gap: 30px;
`;

const BlueprintImageInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .blueprint-image-title {
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const StyledDeleteIcon = styled(Button)`
  ${ButtonIconMixin};
`;

const SeatsEmptyState = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 30px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.extraLightBlue};
  width: fit-content;

  .seats-empty-state-text {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`;

const StyledInfoIcon = styled(images.Info)`
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledLoadingSpinner = styled(LoadingSpinner)`
  align-self: center;
  margin: auto;
`;

const SyledModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;

  > div {
    width: 520px;
    height: 351px;
    background-color: white;
    padding: 50px;
  }

  .warning-modal-info-wrapper {
    margin-bottom: 50px;
  }

  .warning-modal-title {
    font-size: 22px;
    color: ${({ theme }) => theme.colors.orange};
    font-weight: 700;
    margin-bottom: 20px;
  }

  .warning-modal-button-wrapper {
    display: flex;
    justify-content: space-between;
    column-gap: 20px;
  }
`;

const TABLE_HEADERS_SEATS = ['Nombre del plano', 'Posición', 'Tipo', 'Habilitado'];

const TABLE_HEADERS_USERS = ['Nombre', 'Rol', 'Usuario', 'Equipo', 'Estado', 'Acción'];

export default function LocationFloorSeatsPage() {
  const [showCollaborators, setShowCollaborators] = useState<boolean>(false);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>();

  const router = useRouter();
  const { locationId, floorId } = router.query;

  const { data: userData } = useGetMe();
  const { data: users = [] } = useGetCompanyUsers(Number(userData?.companies?.[0]?.id), {});

  const { currentBlueprint, currentFloor } = useFilterOptions();
  const { data: seats = [], isLoading: loadingSeats } = useGetSeats(Number(currentBlueprint.id));
  const { mutateAsync: updateBlueprint, isLoading: loadingBlueprint } = useUpdateBlueprint(
    currentFloor.locationId.toString()
  );

  const { data: usersBlueprint } = useGetUsersBlueprint(Number(currentBlueprint.id));

  const { mutateAsync: associateUsers, isLoading: loadingAddUsers } = useSetUsersBlueprints(currentBlueprint.id);
  const { mutateAsync: deleteUser } = useDeleteUserBlueprint();

  const totalSeatsWithoutGeometry = useMemo(() => seats.filter(s => !s.geometry).length, [seats]);

  const parsedSeatsForTable = useMemo(
    () =>
      seats.map(s => [
        { variant: 'text', text: currentFloor.label },
        { variant: 'text', text: s.name },
        { variant: 'text', text: spaceTypeFilterLabels[s.spaceType?.value as SpaceTypeEnum] },
        { variant: 'text', text: s.isAvailable ? 'Si' : 'No' },
      ]) as unknown as TypeData[][],
    [currentFloor.label, seats]
  );

  const parsedUsersForTable = useMemo(
    () =>
      usersBlueprint?.map(user => [
        { variant: 'avatar', title: `${user.firstName} ${user.lastName}`, subtitle: user.email },
        { variant: 'text', text: user.companyRole },
        {
          variant: 'text',
          text: getUserRoleLabels(user.userRole?.value || UserRole.MEMBER),
        },
        { variant: 'text', text: 'Ventas' },
        {
          variant: 'chip',
          text: user.status === UserStatus.APPROVED ? 'Activo' : 'Pendiente',
          type: user.status === UserStatus.APPROVED ? 'success' : 'danger',
        },
        {
          variant: 'custom',
          children: (
            <Button
              variant='transparent'
              leadingIcon={<images.TinyBin />}
              onClick={e => {
                e.stopPropagation();
                deleteUser({ blueprintId: currentBlueprint.id, userId: user.id });
              }}
            />
          ),
        },
      ]) as unknown as TypeData[][],
    [currentBlueprint.id, deleteUser, usersBlueprint]
  );

  const handlerShowCollaborators = (val: boolean) => {
    setShowCollaborators(val);
  };

  const handleOnLoadBlueprint = async (file: File[], successMsg: string) => {
    try {
      const data = new FormData();
      data.append('blueprint', file[0]);
      await updateBlueprint({ data, blueprintId: currentBlueprint.id });
      toast.success(successMsg);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleDeleteBlueprint = () => {
    if (seats.length === totalSeatsWithoutGeometry || !seats.length) {
      handleOnLoadBlueprint([], 'Plano borrado con éxito');
      return;
    }

    setShowWarningModal(true);
  };

  const handleDeleteFromModal = async () => {
    try {
      await handleOnLoadBlueprint([], 'Plano borrado con éxito');
      setShowWarningModal(false);
    } catch (e) {
      setShowWarningModal(false);
      toast.error((e as Error).message);
    }
  };

  // eslint-disable-next-line no-nested-ternary
  const buttonText = !seats.length
    ? 'Agregar posiciones'
    : !totalSeatsWithoutGeometry
    ? 'Ver posiciones'
    : `Ubicar ${totalSeatsWithoutGeometry} ${totalSeatsWithoutGeometry === 1 ? 'posición' : 'posiciones'} en el
  plano`;

  const handleButtonClick = () => router.push(`/workplace-manager/locations/${locationId}/edit?floorId=${floorId}`);
  return (
    <Layout>
      <LayoutWrapper>
        <StyledHeader>
          <GoBackTitle title={currentFloor.label} onClick={() => router.back()} />
          {!showCollaborators ? (
            <Button onClick={handleButtonClick} disabled={!currentBlueprint.url}>
              {buttonText}
            </Button>
          ) : (
            <Button onClick={() => setShowAddCollaboratorModal(true)}>Agregar Colaboradores</Button>
          )}
        </StyledHeader>

        <ActionsSeats>
          <CustomTabs
            tabs={[
              { title: 'Posiciones', isActive: !showCollaborators, onClick: () => handlerShowCollaborators(false) },
              { title: 'Colaboradores', isActive: showCollaborators, onClick: () => handlerShowCollaborators(true) },
            ]}
          />
        </ActionsSeats>
        {!showCollaborators ? (
          <div>
            {!currentBlueprint.url && !loadingBlueprint ? (
              <>
                <Title>Carga el plano de tu oficina para empezar a ubicar las posiciones</Title>
                <FileUploaderWrapper>
                  <FileUploader
                    useCase='blueprint'
                    onChangeFiles={file => handleOnLoadBlueprint(file, 'Plano creado con éxito')}>
                    <FileUploaderInfoWrapper>
                      <div className='dropzone-info-text'>Arrastra una imagen del plano (.png ó .jpg) ó</div>
                      <div className='dropzone-info-link'>selecciona un archivo desde tu computadora</div>
                    </FileUploaderInfoWrapper>
                  </FileUploader>
                </FileUploaderWrapper>
              </>
            ) : (
              <BlueprintImageContainer>
                {loadingBlueprint ? (
                  !showWarningModal && <StyledLoadingSpinner />
                ) : (
                  <>
                    {currentBlueprint.url && (
                      <Image
                        src={currentBlueprint.url}
                        objectFit='cover'
                        objectPosition='center'
                        width={120}
                        height={80}
                      />
                    )}
                    <BlueprintImageInfo>
                      <p className='blueprint-image-title'>{currentFloor.label}</p>
                      <StyledDeleteIcon
                        disabled={loadingBlueprint}
                        variant='tertiary'
                        leadingIcon={<images.TinyBin />}
                        onClick={handleDeleteBlueprint}
                      />
                    </BlueprintImageInfo>
                  </>
                )}
              </BlueprintImageContainer>
            )}

            {!seats.length ? (
              <SeatsEmptyState>
                <StyledInfoIcon />
                <p className='seats-empty-state-text'>Aún no tienes asientos asignados a este plano</p>
              </SeatsEmptyState>
            ) : (
              <CustomTable headers={TABLE_HEADERS_SEATS} data={parsedSeatsForTable} loading={loadingSeats} />
            )}
          </div>
        ) : (
          <CustomTable headers={TABLE_HEADERS_USERS} data={parsedUsersForTable} loading={loadingSeats} />
        )}
      </LayoutWrapper>

      {showWarningModal && (
        <SyledModal>
          <div className='warning-modal-info-wrapper'>
            <p className='warning-modal-title'>Importante:</p>
            <p>
              Para no perder todos los asientos y sus reservas asignadas a este plano, deberá cargar una imagen con la
              misma cantidad de pixeles que la anterior
            </p>
          </div>
          <div className='warning-modal-button-wrapper'>
            <Button variant='fourth' onClick={() => setShowWarningModal(false)}>
              Candelar
            </Button>
            <Button disabled={loadingBlueprint} variant='tertiary' onClick={handleDeleteFromModal}>
              Borrar
              {loadingBlueprint && <LoadingSpinner />}
            </Button>
          </div>
        </SyledModal>
      )}
      {showAddCollaboratorModal && (
        <AddUsersModal
          users={users.filter(us => !usersBlueprint?.find(ub => us.id === ub.id))}
          isLoading={loadingAddUsers}
          onClickClose={() => setShowAddCollaboratorModal(false)}
          onSave={res => {
            if (res) {
              usersBlueprint?.push(...res);
              associateUsers(usersBlueprint || []);
            }
            setShowAddCollaboratorModal(false);
          }}
        />
      )}
    </Layout>
  );
}
