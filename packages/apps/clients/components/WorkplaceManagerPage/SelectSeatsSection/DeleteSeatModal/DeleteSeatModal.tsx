import React from 'react';
import { Button, LoadingSpinner, Modal } from '@wimet/apps-shared';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import useDeleteSeat from '../../../../hooks/api/useDeleteSeat';
import { MarkerProps } from '../../../../hooks/useBlueprintToolbar';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    display: flex;
    width: 520px;
    height: 248px;
    max-height: 100vh;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    & > div {
      text-align: left;
      padding: 64px 100px;
      & > button:first-child {
        color: ${({ theme }) => theme.colors.darkGray};
      }
    }
  }
`;

const StyledModalTitle = styled.h6`
  text-align: center;
`;

const StyledButtonsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 24px;
`;

type DeleteSeatModalProps = {
  seat: MarkerProps;
  onClose: () => void;
};

const DeleteSeatModal = ({ seat, onClose }: DeleteSeatModalProps) => {
  const router = useRouter();
  const { locationId } = router.query;

  const { mutateAsync: deleteSeat, isLoading } = useDeleteSeat(locationId as string);
  const handleOnClickDelete = () => {
    deleteSeat({ seatId: seat.id || '' });
    onClose();
  };
  return (
    <StyledWrappedModal onClose={onClose}>
      <StyledModalTitle>¿Eliminar asiento?</StyledModalTitle>

      <StyledButtonsContainer>
        <Button variant='outline' onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant='primary'
          onClick={handleOnClickDelete}
          trailingIcon={isLoading ? <LoadingSpinner /> : undefined}
          disabled={isLoading}>
          Eliminar
        </Button>
      </StyledButtonsContainer>
    </StyledWrappedModal>
  );
};

export default DeleteSeatModal;
