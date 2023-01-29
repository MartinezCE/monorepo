/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { useGroupDays } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useCallback, useMemo, useState } from 'react';

export const ALL_DAYS = 'ALL_DAYS';
export const WORK_DAYS = 'WORK_DAYS';
export const CUSTOM = 'CUSTOM';
export const NUMERIC_ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
export const NUMERIC_WORK_DAYS = [0, 1, 2, 3, 4];

type Props = {
  fieldName: string;
  defaultValues?: any[];
  onChange?: (daysOfWeek: number[]) => void;
};

const selectOptions = [
  { label: 'Todos los días', value: ALL_DAYS },
  { label: 'Todos los días laborales', value: WORK_DAYS },
  { label: 'Personalizado', value: CUSTOM },
];

const useSchedule = ({ fieldName, defaultValues = [], onChange }: Props) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [selectValue, setSelectValue] = useState(selectOptions[2]);
  const days = useMemo(
    () => (values[fieldName].length > 0 ? values[fieldName] : defaultValues),
    [values, fieldName, defaultValues]
  );
  const groups = useGroupDays({ days });

  const isLineEmpty = (daysOfWeek: any) => daysOfWeek.includes(null);

  const addDay = useCallback(
    (index: number | null, metadata: any, daysOfWeek = []) => {
      const newDays = [...days];

      let dayIndex = -1;
      const lineEmpty = isLineEmpty(daysOfWeek);

      if (lineEmpty) {
        dayIndex = newDays.findIndex(day => day.dayOfWeek === null);
      } else {
        dayIndex = newDays.findIndex(day => day.dayOfWeek === index);
      }

      const existentDayIndex = newDays.findIndex(day => day.dayOfWeek === index);

      const data = {
        dayOfWeek: index,
        ...metadata,
      };

      if (dayIndex === -1) {
        newDays.push(data);
      } else {
        newDays[dayIndex] = data;
      }

      if (existentDayIndex > -1 && lineEmpty) {
        newDays.splice(existentDayIndex, 1);
      }

      setFieldValue(fieldName, newDays);
      onChange?.(newDays.map(({ dayOfWeek }) => dayOfWeek));
    },
    [days, fieldName, setFieldValue, onChange]
  );

  const removeDays = useCallback(
    (indexs: number[]) => {
      const newDays = [...days];

      indexs.forEach(i => {
        const dayIndex = newDays.findIndex(day => day.dayOfWeek === i);

        if (dayIndex !== -1) {
          newDays.splice(dayIndex, 1);
        }
      });

      setFieldValue(fieldName, newDays);
      onChange?.(newDays.map(({ dayOfWeek }) => dayOfWeek));
    },
    [days, fieldName, setFieldValue, onChange]
  );

  const handleChange = useCallback(
    (isSelected, dayOfWeek: number, meta?: any, daysOfWeek?: any) => {
      if (isSelected) {
        removeDays([dayOfWeek]);
      } else {
        addDay(dayOfWeek, meta, daysOfWeek);
      }
    },
    [addDay, removeDays]
  );

  const handleAddClick = (meta: any) => {
    addDay(null, meta);
  };

  const handleRemoveClick = (daysOfWeek: number[]) => {
    removeDays(daysOfWeek);
  };

  const handleChangeSelect = (e: any, meta: any) => {
    if (e.value === ALL_DAYS) {
      setFieldValue(
        fieldName,
        NUMERIC_ALL_DAYS.map(d => ({
          dayOfWeek: d,
          ...meta,
        }))
      );
      setSelectValue(selectOptions[0]);
    } else if (e.value === WORK_DAYS) {
      setFieldValue(
        fieldName,
        NUMERIC_WORK_DAYS.map(d => ({
          dayOfWeek: d,
          ...meta,
        }))
      );
      setSelectValue(selectOptions[1]);
    } else if (e.value === CUSTOM) {
      setSelectValue(selectOptions[2]);
    }
  };

  return {
    handleAddClick,
    handleRemoveClick,
    groups,
    addDay,
    removeDays,
    days,
    handleChange,
    handleChangeSelect,
    selectOptions,
    selectValue,
    setSelectValue,
  };
};

export default useSchedule;
