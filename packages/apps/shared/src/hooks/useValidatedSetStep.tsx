/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikContextType, FormikErrors, FormikValues, setNestedObjectValues } from 'formik';

const useValidatedSetStep = ({
  formik,
  stepsLength,
  setStep,
}: {
  formik: FormikContextType<any>;
  stepsLength: number;
  setStep: (step: number) => void;
}) => {
  const validatedSetStep = async (newStep: number) => {
    const err = await (formik.setTouched(setNestedObjectValues(formik.values, true)) as unknown as Promise<
      FormikErrors<FormikValues>
    >);
    if (Object.keys(err || {}).length || newStep < 0 || newStep > stepsLength - 1) return;
    setStep(newStep);
  };

  return validatedSetStep;
};

export default useValidatedSetStep;
