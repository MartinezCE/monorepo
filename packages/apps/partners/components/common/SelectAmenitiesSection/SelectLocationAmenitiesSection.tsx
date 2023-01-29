import { AmenityType } from '@wimet/apps-shared';
import FeedbackAddLocationAmenityModal from './FeedbackAddLocationAmenityModal';
import SelectAmenitiesSection from './SelectAmenitiesSectionBase';

type Props = {
  description: string;
};

export default function SelectLocationAmenitiesSection({ description }: Props) {
  return (
    <SelectAmenitiesSection
      description={description}
      amenitiesType={[AmenityType.LOCATION, AmenityType.SAFETY]}
      addModalComponent={(handleModalClose, handleModalConfirm) => (
        <FeedbackAddLocationAmenityModal onClose={handleModalClose} onConfirm={handleModalConfirm} />
      )}
    />
  );
}
