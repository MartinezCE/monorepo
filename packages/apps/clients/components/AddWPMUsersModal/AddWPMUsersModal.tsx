import React from 'react';
import {
  Button,
  CompanyWPMUser,
  images,
  Input,
  Modal,
  pluralize,
  LoadingSpinner,
  Table,
  useGetMe,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import useUserTable from '../../hooks/useUserTable';
import { useGetCompanyWPMUsers } from '../../hooks/api/useGetCompanyWPMUsers';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    width: 835px;
    height: 806px;
    background-color: ${({ theme }) => theme.colors.extraLightGray};
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;
const StyledContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 72px 115px 72px 115px;
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
  align-items: flex-end;
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
  onClickClose: () => void;
  initialSelectedUsers?: CompanyWPMUser[];
  onClickAdd: (users: CompanyWPMUser[]) => void;
  isLoading?: boolean;
  isWPMEnabled?: boolean;
};

const AddWPMUsersModal = ({
  onClickAdd,
  onClickClose,
  initialSelectedUsers,
  isLoading,
  isWPMEnabled = false,
}: Props) => {
  const { data: userData } = useGetMe();
  const { data: companyUsers = [] } = useGetCompanyWPMUsers(Number(userData?.companies?.[0]?.id), { isWPMEnabled });
  const formik = useFormik({
    initialValues: { search: '' },
    onSubmit: () => {},
  });

  const { rows, getTableProps, headerGroups, prepareRow, getTableBodyProps, selectedFlatRows } = useUserTable({
    users: companyUsers,
    initialSelectedUsers,
  });

  const handleOnClickAdd = () => onClickAdd(selectedFlatRows.map(row => row.original));

  return (
    <StyledWrappedModal onClose={onClickClose}>
      <FormikProvider value={formik}>
        <StyledContentWrapper>
          <StyledTitle>Agregar usuarios</StyledTitle>
          <StyledSearchAreaWrapper>
            <StyledSearchInput
              placeholder='Buscar por nombre o mail'
              name='searchValue'
              leadingAdornment={<StyledSearchIcon />}
            />
            <StyledSelectedText>{pluralize(selectedFlatRows.length, 'seleccionado', true)}</StyledSelectedText>
          </StyledSearchAreaWrapper>
          <StyledTableWrapper>
            <Table
              rows={rows}
              tableProps={getTableProps()}
              headerGroups={headerGroups}
              prepareRow={prepareRow}
              bodyProps={getTableBodyProps()}
            />
          </StyledTableWrapper>
          <StyledActionsWrapper>
            <Button variant='outline' onClick={onClickClose}>
              Cancelar
            </Button>
            <StyledAddButton
              disabled={!selectedFlatRows.length || isLoading}
              trailingIcon={isLoading ? <LoadingSpinner /> : undefined}
              onClick={handleOnClickAdd}>
              Agregar miembros
            </StyledAddButton>
          </StyledActionsWrapper>
        </StyledContentWrapper>
      </FormikProvider>
    </StyledWrappedModal>
  );
};

export default AddWPMUsersModal;
