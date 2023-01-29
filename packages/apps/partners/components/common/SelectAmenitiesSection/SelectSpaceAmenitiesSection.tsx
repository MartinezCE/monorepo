import { AmenityType } from '@wimet/apps-shared';
import FeedbackAddSpaceAmenityModal from './FeedbackAddSpaceAmenityModal';
import SelectAmenitiesSection from './SelectAmenitiesSectionBase';

type Props = {
  description: string;
};

export default function SelectSpaceAmenitiesSection({ description }: Props) {
  return (
    <SelectAmenitiesSection
      description={description}
      amenitiesType={[AmenityType.SPACE]}
      addModalComponent={(handleModalClose, handleModalConfirm) => (
        <FeedbackAddSpaceAmenityModal onClose={handleModalClose} onConfirm={handleModalConfirm} />
      )}
    />
  );
}
