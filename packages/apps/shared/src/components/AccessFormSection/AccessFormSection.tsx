import { useFormikContext } from 'formik';
import styled from 'styled-components';
import InnerStepFormLayout from '../InnerStepFormLayout';
import Input from '../Input';
import Textarea from '../Textarea';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  margin-top: 48px;
  max-width: 365px;
`;
type Props = {
  description: string;
};

export default function AccessFormSection({ description }: Props) {
  const formik = useFormikContext<{ accessCode: string }>();
  const regex = /[0-9]+$/gm;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    formik.setFieldValue('accessCode', e.target.value.match(regex)?.[0] || '');

  return (
    <InnerStepFormLayout label='Acceso' description={description}>
      <StyledWrapper>
        <Input
          label='Código'
          placeholder='Ingresa un valor'
          name='accessCode'
          maxLength={4}
          value={formik.values.accessCode}
          onChange={handleCodeChange}
        />
        <Textarea
          label='Comentarios'
          placeholder='Agrega algún comentario extra que sea de utilidad para quienes ingresen a tu espacio.'
          name='comments'
          rows={4}
        />
      </StyledWrapper>
    </InnerStepFormLayout>
  );
}
