import { useEffect, useMemo, useState } from 'react';
import { format, set } from 'date-fns';
import { groupBy, flatten } from 'lodash';
import { es } from 'date-fns/locale';
import useCheckboxList from './useCheckboxList';

const dateReset = { minutes: 0, seconds: 0, hours: 0, milliseconds: 0 };

type Props = {
  initialDateList: Array<Date>;
};

const useDateList = ({ initialDateList }: Props) => {
  const initialDateListParsed = initialDateList?.map(date => set(date, dateReset).toISOString());
  const { checked, handleChange } = useCheckboxList({
    defaultChecked: initialDateListParsed,
  });
  const [list, setList] = useState(initialDateList);
  useEffect(() => {
    setList(checked.map(date => new Date(date)));
  }, [checked]);

  const description = useMemo(() => {
    const yearDates = checked.map(date => {
      const currDate = new Date(date);
      return {
        year: currDate.getFullYear(),
        monthDates: {
          dayDates: currDate,
          month: format(currDate, 'MMMM', { locale: es }),
        },
      };
    });

    const groupByYears = groupBy(yearDates, 'year');

    const dates = Object.keys(groupByYears).map(yearInList => {
      const year = groupByYears[yearInList];
      const monthDates = year.map(date => ({
        date: date.monthDates,
        month: format(date.monthDates.dayDates, 'MMMM', { locale: es }),
      }));
      const groupByMonths = groupBy(monthDates, 'month');
      const descriptionItems = Object.keys(groupByMonths).map(month => {
        const datesOnMonth = groupByMonths[month]
          .map(dateOnMonth => format(dateOnMonth.date.dayDates, 'dd'))
          .join(', ');
        return `${datesOnMonth} de ${month}`;
      });
      return descriptionItems.map(dateMonths => `${dateMonths} de ${yearInList}`);
    });

    return flatten(dates);
  }, [checked]);

  const handleCheckboxListChange = (date: Date) => {
    handleChange(date.toISOString());
  };

  return { list, handleCheckboxListChange, description };
};

export default useDateList;
