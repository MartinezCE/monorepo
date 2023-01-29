import { useFormikContext } from 'formik';
import { useCallback, useEffect } from 'react';

const useUpdateOnBlur = () => {
  const { touched, submitForm, validateForm, setTouched, setStatus, isSubmitting } = useFormikContext();

  const handleUpdate = useCallback(async () => {
    setStatus({ manualSubmitting: true });
    const errors = await validateForm();

    if (!Object.keys(errors).length) {
      await submitForm();
      setTouched({});
    }

    setStatus();
  }, [setStatus, setTouched, submitForm, validateForm]);

  useEffect(() => {
    if (Object.keys(touched).length && !isSubmitting) {
      handleUpdate();
    }
  }, [handleUpdate, isSubmitting, touched]);
};

export default useUpdateOnBlur;
