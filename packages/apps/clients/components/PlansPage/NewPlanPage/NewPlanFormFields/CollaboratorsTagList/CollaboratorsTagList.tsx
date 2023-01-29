/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, ErrorText, images, Pill, User } from '@wimet/apps-shared';
import styled from 'styled-components';
import { ErrorMessage, useFormikContext } from 'formik';
import AddUsersModal from '../../../../AddUsersModal';
import { NewPlanFormValues } from '../../../../../pages/pass/plans/new/[planType]';

const StyledWrapper = styled.div``;

const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
`;

const StyledLabel = styled.div`
  font-size: 14px;
`;

const StyledQtyLabel = styled.div`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const StyledButtonWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const StyledTagWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 24px;
  max-height: 174px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
`;

const CollaboratorsTagList = () => {
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const formik = useFormikContext<NewPlanFormValues>();
  const { collaborators } = formik.values;

  const handleOnAddMembers = (selectedUsers: User[]) => {
    formik.setFieldValue('collaborators', selectedUsers);
    setShowAddMembersModal(false);
  };

  const handleOnClickRemove = (user: User) =>
    formik.setFieldValue(
      'collaborators',
      collaborators.filter(c => c.id !== user.id)
    );

  return (
    <StyledWrapper>
      <StyleHeader>
        <StyledLabel>Colaboradores</StyledLabel>
        {!!collaborators.length && <StyledQtyLabel>{collaborators.length} en total</StyledQtyLabel>}
      </StyleHeader>
      {!!collaborators.length && (
        <StyledTagWrapper>
          {collaborators.map(u => (
            <Pill key={u.id} text={`${u.firstName} ${u.lastName}`} onClickClose={() => handleOnClickRemove(u)} />
          ))}
        </StyledTagWrapper>
      )}
      <StyledButtonWrapper>
        <Button variant='outline' onClick={() => setShowAddMembersModal(true)} trailingIcon={<images.TinyMore />}>
          Agregar miembros
        </Button>
        <ErrorMessage
          name='collaborators'
          render={e => typeof e === 'string' && <ErrorText position='absolute'>{e}</ErrorText>}
        />
      </StyledButtonWrapper>
      {showAddMembersModal && (
        <AddUsersModal
          onClickClose={() => setShowAddMembersModal(false)}
          initialSelectedUsers={collaborators}
          users={collaborators}
          onSave={handleOnAddMembers}
        />
      )}
    </StyledWrapper>
  );
};

export default CollaboratorsTagList;
