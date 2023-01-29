import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { mergeSchemas, getCountries, GET_COUNTRIES, LoadingModal, useWindowPopup } from '@wimet/apps-shared';
import { AddCompanyStep, AddContactStep } from '../../components/RegisterPartnersPage';
import { getCompanyTypes, GET_COMPANY_TYPES } from '../../hooks/api/Location/useGetCompanyTypes';
import useCreateUser, { CreateUserPayload } from '../../hooks/api/Auth/useCreateUser';
import { handleGoogleLogin } from '../../utils/google';
import TypeFormStep from '../../components/RegisterPartnersPage/TypeFormStep';
import FeedbackRegisterModal from '../../components/common/FeedbackRegisterModal';

const initialValues = {
  company: { name: '', companyTypeId: 1, country: 1, stateId: 1 },
  firstName: '',
  lastName: '',
  password: '',
  repeatPassword: '',
  phoneNumber: '',
  email: '',
};

export type RegisterInitialValues = typeof initialValues;

const validationSchemas = [
  Yup.object().shape({
    company: Yup.object().shape({
      name: Yup.string()
        .trim()
        .required('Este campo es obligatorio')
        .min(4, 'El nombre debe contener al menos 4 carácteres'),
      companyTypeId: Yup.number().required('Este campo es obligatorio'),
      country: Yup.number().required('Este campo es obligatorio'),
      stateId: Yup.number().required('Este campo es obligatorio'),
    }),
  }),
  Yup.object().shape({
    firstName: Yup.string().trim().required('Este campo es obligatorio').min(1),
    lastName: Yup.string().trim().required('Este campo es obligatorio').min(1),
    password: Yup.string()
      .trim()
      .required('Este campo es obligatorio')
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    repeatPassword: Yup.string()
      .trim()
      .required('Este campo es obligatorio')
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
    phoneNumber: Yup.string().trim().required('Este campo es obligatorio').min(10, 'El número debe tener 10 dígitos'),
    email: Yup.string().trim().required('Este campo es obligatorio').email('El email no es válido'),
  }),
];

const schemas = mergeSchemas(validationSchemas);

enum CONFIG {
  OTHER_COUNTRY = -1,
  COMPANY_STEP = 0,
  CONTACT_STEP = 1,
  LOADING_MODAL = 2,
  FEEDBACK_MODAL = 3,
}

export default function RegisterPage() {
  const [step, setStep] = useState(CONFIG.COMPANY_STEP);
  const router = useRouter();
  const { mutateAsync } = useCreateUser('partners');
  const { openPopup } = useWindowPopup();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[Math.min(step, CONFIG.CONTACT_STEP)],
    // eslint-disable-next-line consistent-return
    onSubmit: async (values, _formik) => {
      try {
        if (step < CONFIG.CONTACT_STEP) return setStep(step + 1);
        await mutateAsync(schemas.cast(values, { stripUnknown: true }) as unknown as CreateUserPayload);
        setStep(CONFIG.FEEDBACK_MODAL);
      } finally {
        _formik.setTouched({});
        _formik.setSubmitting(false);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    setStep(CONFIG.LOADING_MODAL);
    const payload = Buffer.from(JSON.stringify({ company: formik.values.company, userType: 'PARTNER' })).toString(
      'base64'
    );

    handleGoogleLogin({
      openPopup,
      popupUrlQuery: payload,
      onClose: () =>
        setStep(prevStep => {
          if (prevStep > CONFIG.LOADING_MODAL) return prevStep;
          return CONFIG.CONTACT_STEP;
        }),
      onSuccess: () => setStep(CONFIG.FEEDBACK_MODAL),
    });
  };

  return (
    <FormikProvider value={formik}>
      <Form>
        {step === CONFIG.OTHER_COUNTRY && <TypeFormStep />}
        {step === CONFIG.COMPANY_STEP && (
          <AddCompanyStep
            isSubmitting={formik.isSubmitting}
            onSelectOtherCountry={() => setStep(CONFIG.OTHER_COUNTRY)}
          />
        )}
        {step > CONFIG.COMPANY_STEP && (
          <AddContactStep isSubmitting={formik.isSubmitting} onGoogleSignIn={handleGoogleSignIn} />
        )}
        {step === CONFIG.LOADING_MODAL && <LoadingModal />}
        {step === CONFIG.FEEDBACK_MODAL && (
          <FeedbackRegisterModal
            onClose={() => router.replace(`${process.env.NEXT_PUBLIC_PARTNERS_URL}/locations`)}
            onFinish={() => router.replace(`${process.env.NEXT_PUBLIC_PARTNERS_URL}/locations/new`)}
          />
        )}
      </Form>
    </FormikProvider>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(GET_COMPANY_TYPES, getCompanyTypes),
    queryClient.prefetchQuery(GET_COUNTRIES, getCountries),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
