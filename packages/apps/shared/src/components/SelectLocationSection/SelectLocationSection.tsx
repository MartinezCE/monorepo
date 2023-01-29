import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { useMap } from '../../hooks';
import PlacesDropdown, { SearchProps } from '../PlacesDropdown';
import Textarea from '../Textarea';
import BlockInfo from '../BlockInfo';
import Map from '../Map';
import Marker from '../Marker';
import Input from '../Input';

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 40px;
`;

const StyledInputContainer = styled.div`
  > div:not(:last-child) {
    margin-bottom: 40px;
  }
`;

const StyledMapContainer = styled.div`
  min-height: 284px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 8px;
  overflow: hidden;
`;

const SelectLocationSection = ({ hideDescription = false }: { hideDescription?: boolean }) => {
  const formik = useFormikContext<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  const { map, setRef } = useMap({
    center: formik.values.location,
    zoom: 15,
    onClick: e =>
      formik.setFieldValue('location', {
        lat: e.latLng?.lat() || formik.initialValues.location.lat,
        lng: e.latLng?.lng() || formik.initialValues.location.lng,
      }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setValues(prevState => ({ ...prevState, [e.target.name]: e.target.value, isAddressValid: false }));
  };

  const handleSearch = ({ viewport, formattedAddress, lat, lng, ...props }: SearchProps) =>
    formik.setValues(prevState => ({
      ...prevState,
      ...props,
      address: formattedAddress,
      isAddressValid: true,
      location: { lat, lng },
    }));

  /*   const { data: states = [] } = useGetAllStates(countryId, {
    select: dataStates =>
      dataStates.map(item => ({
        value: item.id,
        label: item.name,
      })),
  }); */

  return (
    <StyledWrapper>
      <StyledInputContainer>
        <Input name='name' label='Nombre de la locación' placeholder='Nombre de tu edificio / Sede' />
        {/*         <Select label='Provincia' options={states} instanceId='Provincia' name='stateId' placeholder='Buenos Aires' /> */}
        <PlacesDropdown
          label='Dirección'
          placeholder='Av. Corrientes 1290'
          name='address'
          map={map}
          onChange={handleChange}
          onSearch={handleSearch}
        />
        {!hideDescription && (
          <Textarea
            label='Descripción'
            placeholder='Agrega una descripción que cuente de manera atractiva los amenities principales de tu locación.'
            rows={4}
            name='description'
          />
        )}
        <BlockInfo>
          Luego de cargar la información deberá pasar por un proceso de aceptación antes de ser publicado.
        </BlockInfo>
      </StyledInputContainer>
      <StyledMapContainer>
        <Map apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} ref={el => el && setRef(el)} map={map}>
          <Marker map={map} position={formik.values.location} defaultMarkerVariant='selected' />
        </Map>
      </StyledMapContainer>
    </StyledWrapper>
  );
};

export default SelectLocationSection;
