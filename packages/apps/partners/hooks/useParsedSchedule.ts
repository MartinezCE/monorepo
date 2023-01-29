import { useFormikContext } from 'formik';
import { EditSpaceInitialValues } from '../pages/locations/[locationId]/spaces/[spaceId]/edit';

const useParsedSchedule = () => {
  const { setFieldValue, values } = useFormikContext<EditSpaceInitialValues>();

  const handleOnChange = () =>
    setFieldValue(
      'schedule',
      values.schedule.filter(({ dayOfWeek }) => values.hourly?.some(({ dayOfWeek: d }) => d === dayOfWeek))
    );

  return { handleOnChange };
};

export default useParsedSchedule;
