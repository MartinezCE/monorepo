/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Button, images, Input, Modal, pluralize, LoadingSpinner, Table, User, EmptyState } from '@wimet/apps-shared';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import useUserTable from '../../hooks/useUserTable';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    width: 835px;
    height: 600px;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;
const StyledContentWrapper = styled.div`
  width: 100%;
  max-height: 80%;
  padding: 0 5em 0 5em;
`;

const StyledSearchInput = styled(Input)`
  width: 390px;
`;

const StyledTitle = styled.div`
  width: 100%;
  text-align: left;
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 40px;
`;

const StyledSearchIcon = styled(images.Search)`
  padding: 14px 0 14px 24px;
  box-sizing: content-box;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledSearchAreaWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48px;
`;

const StyledSelectedText = styled.div`
  font-size: 14px;
  font-weight: 200;
  margin-left: 24px;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledTableWrapper = styled.div`
  max-height: calc(100% - 272px);
  overflow-y: auto;
`;

const StyledActionsWrapper = styled.div`
  width: 100%;
  margin-top: 64px;
  display: flex;
  justify-content: center;
`;

const StyledAddButton = styled(Button)`
  margin-left: 24px;
`;

type Props = {
  title?: string;
  onClickClose: () => void;
  users: User[];
  initialSelectedUsers?: User[];
  isLoading?: boolean;
  onSave: (users: User[]) => void;
  emptyState?: { title?: string; subtitle?: string };
};

const AddUsersModal = ({
  title = 'Agregar usuarios',
  users,
  onClickClose,
  initialSelectedUsers,
  isLoading,
  onSave,
  emptyState = {
    title: 'De momento no tiene usuarios para agregar',
    subtitle: 'Puede invitar usuarios a su compania en la sección empresas',
  },
}: Props) => {
  const formik = useFormik({
    initialValues: { searchValue: '' },
    onSubmit: () => {},
  });

  const { rows, getTableProps, headerGroups, prepareRow, getTableBodyProps, selectedFlatRows } = useUserTable({
    users,
    initialSelectedUsers,
    searchValue: formik.values.searchValue,
  });

  return (
    <StyledWrappedModal onClose={onClickClose}>
      <FormikProvider value={formik}>
        <StyledContentWrapper>
          {!users.length ? (
            <EmptyState title={emptyState.title} subtitle={emptyState?.subtitle} />
          ) : (
            <>
              <StyledTitle>{title}</StyledTitle>
              <StyledSearchAreaWrapper>
                <StyledSearchInput
                  placeholder='Buscar por nombre o mail'
                  name='searchValue'
                  leadingAdornment={<StyledSearchIcon />}
                />
                <StyledSelectedText>{pluralize(selectedFlatRows.length, 'seleccionado', true)}</StyledSelectedText>
              </StyledSearchAreaWrapper>
              <StyledTableWrapper>
                {!rows.length ? (
                  <EmptyState title='No se encontraron resultados de búsqueda' />
                ) : (
                  <Table
                    rows={rows}
                    tableProps={getTableProps()}
                    headerGroups={headerGroups}
                    prepareRow={prepareRow}
                    bodyProps={getTableBodyProps()}
                  />
                )}
              </StyledTableWrapper>
              <StyledActionsWrapper>
                <Button variant='outline' onClick={onClickClose}>
                  Cancelar
                </Button>
                <StyledAddButton
                  disabled={!selectedFlatRows.length || isLoading}
                  trailingIcon={isLoading ? <LoadingSpinner /> : undefined}
                  onClick={() => onSave(selectedFlatRows.map(row => row.original))}>
                  Agregar
                </StyledAddButton>
              </StyledActionsWrapper>
            </>
          )}
        </StyledContentWrapper>
      </FormikProvider>
    </StyledWrappedModal>
  );
};

export default AddUsersModal;
