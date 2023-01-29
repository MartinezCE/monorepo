import { useState } from 'react';
import { Button, Blueprint, User, BlueprintStatus } from '@wimet/apps-shared';
import styled from 'styled-components';
import ApplyBlueprintsModal from '../WorkplaceManagerPage/ApplyBlueprintsModal';
import AccessOptionsModal from '../WorkplaceManagerPage/AccessOptionsModal';
import ApplyAmenitiesModal from '../WorkplaceManagerPage/ApplyAmenitiesModal/ApplyAmenitiesModal';
import { useGetCompanyBlueprints } from '../../hooks/api/useGetCompanyBlueprints';

const StyledColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const StyledAccessButton = styled(Button)``;

const StyledGiveAccessButton = styled(Button)``;

const StyledAccessText = styled.div`
  margin-right: 4px;
  font-size: 14px;
`;

const StyledAccess = styled(StyledColumn)<{ hasAccess: boolean }>`
  & ${StyledGiveAccessButton} {
    color: ${({ theme: { colors }, hasAccess }) => (hasAccess ? colors.darkBlue : colors.gray)};
  }
  & ${StyledAccessButton} {
    color: ${({ theme: { colors }, hasAccess }) => (hasAccess ? colors.blue : colors.gray)};
  }
  & ${StyledAccessText} {
    color: ${({ theme: { colors }, hasAccess }) => (hasAccess ? colors.darkGray : colors.gray)};
  }
`;

const StyledAcessWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

export enum ModalTypes {
  SELECT = 'SELECT',
  BLUEPRINTS = 'blueprints',
  AMENITIES = 'amenities',
}

type Props = {
  userData: User | undefined;
};

export default function UsersTable({ userData }: Props) {
  const [modal, setModal] = useState<{ type?: ModalTypes; userId?: number; blueprints?: Blueprint[] }>({});
  const { data: companyBlueprints = [] } = useGetCompanyBlueprints(Number(userData?.companies?.[0]?.id), {
    status: BlueprintStatus.PUBLISHED,
  });
  const hasBlueprints = !!companyBlueprints?.length;
  const ButtonComponent = hasBlueprints ? StyledAccessButton : StyledGiveAccessButton;
  const ButtonText = hasBlueprints ? 'accesos otorgados' : 'Dar acceso';
  const handleCloseModal = () => setModal({});
  const handleBack = () => setModal({ ...modal, type: ModalTypes.SELECT });

  return (
    <>
      <StyledAccess hasAccess={!!userData?.isWPMEnabled}>
        <StyledAcessWrapper>
          {hasBlueprints && <StyledAccessText>Ver</StyledAccessText>}
          <ButtonComponent
            variant='transparent'
            onClick={() => {
              if (!userData?.isWPMEnabled) return;
              setModal({ type: ModalTypes.SELECT, userId: userData.id, blueprints: companyBlueprints });
            }}>
            {ButtonText}
          </ButtonComponent>
        </StyledAcessWrapper>
      </StyledAccess>
      {modal.type === ModalTypes.SELECT && (
        <AccessOptionsModal onClick={type => setModal({ ...modal, type })} onClose={handleCloseModal} />
      )}
      {modal.type === ModalTypes.BLUEPRINTS && (
        <ApplyBlueprintsModal
          onClickClose={handleCloseModal}
          onClickBack={handleBack}
          companyBlueprints={companyBlueprints}
          selectedUserId={Number(modal.userId)}
          initialSelectedBlueprints={modal.blueprints}
        />
      )}
      {modal.type === ModalTypes.AMENITIES && (
        <ApplyAmenitiesModal
          onClickClose={handleCloseModal}
          onClickBack={handleBack}
          companyBlueprints={companyBlueprints}
          selectedUserId={Number(modal.userId)}
          initialSelectedBlueprints={modal.blueprints}
        />
      )}
    </>
  );
}
