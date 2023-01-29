import { Button, images, Input, Modal, Profile } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';
import DeleteContactModal from '../../DeleteContactModal';

const StyledWrappedModal = styled(Modal)`
  height: 100vh;
  width: 100vw;
  background-color: rgb(44 48 56 / 80%) !important;
  > div {
    width: 886px;
    height: 680px;
    background-color: white;
    & > div > button {
      color: ${({ theme }) => theme.colors.darkGray};
    }
  }
`;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 72px 96px 88px 96px;
`;
const StyledWrapperHeader = styled.div`
  display: flex;
  width: 100%;
`;
const StyledGrid = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  text-align: initial;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledButton = styled(Button)`
  margin-right: 6px;
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 64px;
`;

const StyledMainActions = styled.div`
  display: flex;
`;
const StyledSaveButton = styled(Button)`
  margin-left: 24px;
`;
const StyledDeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.error};
`;

type Props = {
  contactData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onClickClose?: () => void;
};

const EditContactModal = ({ onClickClose, contactData }: Props) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: contactData.name,
      lastname: contactData.lastname,
      email: contactData.email,
      password: contactData.password,
      phone: contactData.phone,
      position: contactData.position,
    },
    onSubmit: () => {},
  });
  return (
    <FormikProvider value={formik}>
      <StyledWrappedModal onClose={onClickClose}>
        <StyledWrapper>
          <StyledWrapperHeader>
            <Profile
              size='large'
              variant='blue'
              image={contactData.image}
              showUserLabel={false}
              transparent
              onClickAdd={() => {}}
            />
          </StyledWrapperHeader>
          <StyledGrid>
            <Input label='Nombre' name='name' placeholder='Ej. Melisa' />
            <Input label='Apellido' name='lastname' placeholder='Ej. Fernández' />
            <Input label='Correo electrónico' name='email' placeholder='Ej. melisafer@litebox.ai' />
            <Input
              label='Contraseña'
              name='password'
              placeholder='*****'
              type={hidePassword ? 'password' : 'text'}
              trailingAdornment={
                <StyledButton
                  tabIndex={-1}
                  variant='input'
                  leadingIcon={hidePassword ? <images.Eye /> : <images.EyeClosed />}
                  onClick={() => setHidePassword(!hidePassword)}
                />
              }
            />
            <Input label='Teléfono' name='phone' placeholder='Ej. 11 4637 4380' />
            <Input label='Rol en la empresa' name='position' placeholder='RRHH' />
          </StyledGrid>
          <StyledFooter>
            <StyledDeleteButton
              variant='transparent'
              onClick={() => setShowDeleteModal(true)}
              trailingIcon={<images.TinyBin />}>
              Eliminar cuenta
            </StyledDeleteButton>
            <StyledMainActions>
              <Button variant='outline' onClick={() => {}}>
                Cancelar
              </Button>
              <StyledSaveButton variant='primary' disabled>
                Guardar cambios
              </StyledSaveButton>
            </StyledMainActions>
          </StyledFooter>
        </StyledWrapper>
      </StyledWrappedModal>
      {showDeleteModal && <DeleteContactModal onClickClose={() => setShowDeleteModal(false)} />}
    </FormikProvider>
  );
};

export default EditContactModal;
