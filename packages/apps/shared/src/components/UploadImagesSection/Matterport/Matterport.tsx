import { useFormikContext } from 'formik';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import Input from '../../Input';

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  column-gap: 32px;
`;

const StyledIframeContainer = styled.div`
  height: 112px;
  width: 179px;
`;

const StyledIframe = styled.iframe`
  height: 100%;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: fit-content;
  max-width: 390px;
`;

export default function Matterport() {
  const formik = useFormikContext<{ tourUrl: string }>();
  const regex = /(https?:\/\/)?(www\.)?my\.matterport\.com\/show\/\?m=.{11}?(?=[^a-zA-Z0-9]|$)/gm;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    formik.setFieldValue('tourUrl', e.target.value.match(regex)?.[0] || e.target.value);

  const url = formik.values.tourUrl?.match(regex)?.[0];

  return (
    <StyledRow>
      <StyledInput
        label='Virtual Tour URL'
        placeholder='Ingresa la URL de Matterport aquí'
        value={formik.values.tourUrl}
        onChange={handleChange}
        name='tourUrl'
      />
      <StyledIframeContainer>
        {url && (
          <StyledIframe title='iframe' width='100%' height='100%' src={url ? `${url}&log=0` : ''} frameBorder='0' />
        )}
      </StyledIframeContainer>
    </StyledRow>
  );
}
