import { useMemo } from 'react';

const useSelectedRowIds = <T extends { id?: number }, K extends { id?: number }>(
  data: T[],
  selected?: K[]
): { [k: string]: boolean } =>
  useMemo<{ [k: number]: boolean }>(() => {
    if (!selected) return {};

    return data.reduce((acc, d) => ({ ...acc, ...(d.id ? { [d.id]: selected.some(s => s.id === d.id) } : {}) }), {});
  }, [data, selected]);

export default useSelectedRowIds;
