import es from 'date-fns/locale/es';
import {
  default as CoreDatePicker, // eslint-disable-line import/no-named-default
  ReactDatePickerCustomHeaderProps,
  registerLocale,
} from 'react-datepicker';

registerLocale('es', es);

type BaseDatePickerProps = {
  onChange: (date: Date) => void;
  className?: string;
  customHeader?: (params: ReactDatePickerCustomHeaderProps) => React.ReactNode;
  onMonthChange?: (date: Date) => void;
  excludedDates?: Date[];
  highlightedDates?: Date[];
  selected?: Date;
  filterDate?: (date: Date) => boolean;
  minDate?: Date;
  dayClassName?: (date: Date) => string;
  startDate?: Date;
  endDate?: Date;
};

const BaseDatePicker = ({
  onChange,
  className,
  customHeader,
  excludedDates,
  highlightedDates,
  onMonthChange,
  filterDate,
  selected,
  minDate,
  dayClassName,
  startDate,
  endDate,
}: BaseDatePickerProps) => (
  <CoreDatePicker
    onMonthChange={onMonthChange}
    onChange={onChange}
    calendarClassName={className}
    inline
    locale='es'
    filterDate={filterDate}
    selected={selected}
    excludeDates={excludedDates}
    highlightDates={highlightedDates}
    renderCustomHeader={customHeader}
    minDate={minDate}
    dayClassName={dayClassName}
    startDate={startDate}
    endDate={endDate}
  />
);

export default BaseDatePicker;
