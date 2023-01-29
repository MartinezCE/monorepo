/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { useMemo } from 'react';

type Line = {
  daysOfWeek: number[];
  indexs: number[];
} & { [x: string]: any };

const useGroupDays = <T>({ days }: { days: T[] }) =>
  useMemo(() => {
    const lines: (T & Line)[] = [];
    const createNewLine = (index: number, data: any, i: number) => {
      lines.push({
        daysOfWeek: [index],
        indexs: [i],
        ...data,
      });
    };
    days.forEach((day: any, i: number) => {
      const { dayOfWeek, ...dayMeta } = day;

      if (!lines.length && dayOfWeek !== null) {
        createNewLine(dayOfWeek, dayMeta, i);
        return;
      }

      const isMatched = lines.some(line => {
        const { daysOfWeek, indexs, id, disabledDaysOfWeek: lineDisabledDaysOfWeek, ...lineMeta } = line;
        const areEqual = Object.keys(lineMeta).every(key => line[key] === day[key as keyof typeof day]);

        if (areEqual && dayOfWeek !== null) {
          line.daysOfWeek = [...new Set([...daysOfWeek, dayOfWeek])];
          line.indexs = [...new Set([...indexs, i])];
        }

        return areEqual && dayOfWeek !== null;
      });

      if (!isMatched) {
        createNewLine(dayOfWeek, dayMeta, i);
      }
    });

    return lines;
  }, [days]);

export default useGroupDays;
