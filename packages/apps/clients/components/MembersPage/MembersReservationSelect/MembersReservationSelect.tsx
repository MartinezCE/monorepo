import { ClientLocation, Link, LocationStatus, Select, images, Button } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import useGetAllClientLocations from '../../../hooks/api/useGetAllClientLocations';
import useGetMeReservations from '../../../hooks/api/useGetMeReservations';
import useGetSeatsAvailability from '../../../hooks/api/useGetSeatsAvailability';

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 400px;
`;

const StyledAvailabilityWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledAvailabilityText = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;

  > span {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const StyledLink = styled(Link)`
  width: fit-content;
`;

type Props = {
  onCancel: () => void;
};

const MembersReservationSelect = ({ onCancel }: Props) => {
  const [selectedLocation, setSelectedLocation] = useState<ClientLocation | null>(null);
  const bookingUrl = `/spaces/office?locationId=${selectedLocation?.id}&floorId=${selectedLocation?.floors[0].id}&blueprintId=${selectedLocation?.floors[0].blueprints[0]?.id}`;
  const { data } = useGetAllClientLocations(
    {
      status: LocationStatus.PUBLISHED,
      floorsRequired: true,
    },
    {
      select: item =>
        item.map(val => ({
          ...val,
          label: val.name,
          value: val.name,
        })),
    }
  );
  const { data: meReservations } = useGetMeReservations({
    locationId: selectedLocation?.id || 0,
    date: new Date(),
  });

  const formik = useFormik({
    initialValues: { location: null },
    onSubmit: () => {},
  });

  const showAvailability = useMemo(() => formik.values.location !== '', [formik.values.location]);

  const { data: availability } = useGetSeatsAvailability(selectedLocation?.id || 0, {
    enabled: !!selectedLocation,
  });

  const handleOnChangeLocation = (value: unknown) => {
    formik.setFieldValue('location', value);
    setSelectedLocation(value as ClientLocation);
  };

  const StyledActions = styled.div`
    display: flex;
    gap: 20px;
  `;

  return (
    <FormikProvider value={formik}>
      <StyledFormWrapper>
        <Select
          options={data}
          name='location'
          instanceId='locationOptions'
          label='Mis Oficinas'
          placeholder='Contract Workplaces'
          onChange={handleOnChangeLocation}
        />
        {availability && (
          <StyledAvailabilityWrapper>
            <images.Calendar />
            <StyledInnerWrapper>
              <StyledAvailabilityText>
                <span>{availability.seatsAvailable}</span> asientos disponibles
              </StyledAvailabilityText>
              {!!meReservations?.length && (
                <StyledAvailabilityText>
                  Hoy tienes reservado <span>{meReservations.map(r => `${r.seat?.name} `)}</span>
                </StyledAvailabilityText>
              )}
            </StyledInnerWrapper>
          </StyledAvailabilityWrapper>
        )}
        <StyledActions>
          <Button variant='outline' fullWidth={false} onClick={onCancel}>
            Cancelar
          </Button>
          <StyledLink href={showAvailability ? bookingUrl : ''} disabled={!showAvailability}>
            Empezar
          </StyledLink>
        </StyledActions>
      </StyledFormWrapper>
    </FormikProvider>
  );
};

export default MembersReservationSelect;
