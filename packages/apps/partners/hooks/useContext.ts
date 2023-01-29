/* eslint-disable @typescript-eslint/naming-convention */
import { customMergeOmittingUndefined, useCommonContext, useMerge } from '@wimet/apps-shared';
import constate from 'constate';
import { useState } from 'react';

interface DefaultState {
  isSidebarCollapsed: boolean | null;
}

const defaultState: DefaultState = {
  isSidebarCollapsed: false,
};

const _useContext = ({ initialState }: { initialState?: Partial<DefaultState> }) => {
  const commonData = useCommonContext();
  const mergedData = useMerge([commonData, { appData: { ...defaultState, ...(initialState || {}) } }], {
    customMerge: customMergeOmittingUndefined,
  });
  const [appData, setAppData] = useState<typeof mergedData['appData']>(mergedData.appData);

  return { ...mergedData, appData, setAppData };
};

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };
export type { DefaultState };
