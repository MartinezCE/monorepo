/* eslint-disable @typescript-eslint/naming-convention */
import constate from 'constate';
import { useCommonContext } from '@wimet/apps-shared';

const _useContext = () => ({
  ...useCommonContext(),
});

const [ContextProvider, useContext] = constate(_useContext);

export { ContextProvider, useContext };
