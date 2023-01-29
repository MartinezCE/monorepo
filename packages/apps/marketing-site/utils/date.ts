import { addDays, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { capitalize } from 'lodash';

export const getWeekDays = () =>
  [0, 1, 2, 3, 4, 5, 6].map((_, i) => {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    return { date, name: format(date, 'cccc', { locale: es }) };
  });

type Line = {
  daysOfWeek: number[];
  indexs: number[];
} & { [x: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export const getDaysIntervalText = (group: Line) => {
  const weekDays = getWeekDays();
  const days = weekDays.filter((_, i) => group.daysOfWeek.includes(i));
  const isContinuousDays = days.every((d, i) => {
    for (let j = i + 1; j < days.length; j++) {
      return addDays(d.date, 1).getDay() === days[j].date.getDay();
    }
    return true;
  });

  const text =
    isContinuousDays && days.length > 1
      ? capitalize([days[0]?.name, days[days.length - 1]?.name].join(' a '))
      : new Intl.ListFormat().format(days.map(d => d.name));

  return text;
};

export const formattedPostDate = 'PPPP';
