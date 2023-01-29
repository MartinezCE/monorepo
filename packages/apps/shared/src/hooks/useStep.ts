import { useRouter } from 'next/router';
import { useMemo } from 'react';

type HandleOptions = { shallow?: boolean };

const useStep = ({
  initialStep = 1,
  limit,
  defaultShallow = false,
}: {
  initialStep?: number;
  limit?: number;
  defaultShallow?: boolean;
}) => {
  const router = useRouter();
  const parsedStep = Number(router.query?.step || initialStep);
  const MIN = 0;
  const MAX = limit || 999;
  const step = useMemo(() => Math.min(Math.max(parsedStep, MIN), MAX) || 0, [MAX, parsedStep]);
  const isLastStep = useMemo(() => step === limit, [step, limit]);

  const goToStep = (newStep: number, options?: HandleOptions) =>
    router.push(`${router.asPath.split('?')[0]}?step=${newStep}`, undefined, {
      shallow: options?.shallow || defaultShallow,
    });

  const goBackStep = (_steps = 1, options?: HandleOptions) => goToStep(step - _steps, options);
  const goForwardStep = (_steps = 1, options?: HandleOptions) => goToStep(step + _steps, options);

  return {
    router,
    step: { current: step, goBackStep, goForwardStep, goToStep },
    isLastStep,
  };
};

export default useStep;
