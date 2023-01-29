import { useFormikContext } from 'formik';
import { SpaceReservationType } from '@wimet/apps-shared';
import { HubPricesSection, OnDemandPricesSection } from '../../LocationNewSpacePage';
import type { EditSpaceInitialValues } from '../../../pages/locations/[locationId]/spaces/[spaceId]/edit';

export default function PriceAndTermsSection() {
  const { values } = useFormikContext<EditSpaceInitialValues>();

  return (
    <>
      {values.spaceReservationType === SpaceReservationType.HOURLY && <OnDemandPricesSection description='' />}
      {values.spaceReservationType === SpaceReservationType.MONTHLY && (
        <HubPricesSection description='Establecer el precio mensual y el plazo mínimo para este espacio. También puedes añadir precios con incentivos a continuación para fomentar las reservas a largo plazo.' />
      )}
    </>
  );
}
