/* eslint-disable @typescript-eslint/naming-convention */
import constate from 'constate';
import { useCallback, useState } from 'react';

interface DefaultState {
  isSidebarCollapsed: boolean | null;
}

const defaultState: DefaultState = {
  isSidebarCollapsed: null,
};

const _useCommonContext = ({ initialState }: { initialState?: Partial<DefaultState> }) => {
  const [appData, setAppData] = useState<typeof defaultState>({ ...defaultState, ...(initialState || {}) });

  const handleSidebarCollapse = useCallback(
    (isSidebarCollapsed: boolean) => {
      setAppData({
        ...appData,
        isSidebarCollapsed,
      });
    },
    [appData]
  );

  return {
    appData,
    setAppData,
    handleSidebarCollapse,
  };
};

const [CommonContextProvider, useCommonContext] = constate(_useCommonContext);

export { CommonContextProvider, useCommonContext };
export type { DefaultState };
