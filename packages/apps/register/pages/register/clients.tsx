import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { mergeSchemas, getCountries, GET_COUNTRIES, LoadingModal, useWindowPopup } from '@wimet/apps-shared';
import { AddCompanyForm } from '../../components/RegisterCompaniesPage';
import AddContactStep from '../../components/RegisterCompaniesPage/AddContactStep';
import FeedbackRegisterModal from '../../components/common/FeedbackRegisterModal';
import useCreateUser, { CreateUserPayload } from '../../hooks/api/Auth/useCreateUser';
import { handleGoogleLogin } from '../../utils/google';

const initialValues = {
  email: '',
  password: '',
  repeatPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  companyRole: '',
  company: {
    name: '',
    country: 1,
    stateId: 1,
    peopleAmount: '',
    websiteUrl: '',
  },
};

export type RegisterClientsInitialValues = typeof initialValues;

const validationSchemas = [
  Yup.object().shape({
    company: Yup.object().shape({
      name: Yup.string()
        .trim()
        .required('Este campo es obligatorio')
        .min(4, 'El nombre debe contener al menos 4 carácteres'),
      country: Yup.number().required('Este campo es obligatorio'),
      stateId: Yup.number().required('Este campo es obligatorio'),
      peopleAmount: Yup.number()
        .moreThan(0, 'La cantidad de colaboladores debe de ser mayor a 0')
        .required('Este campo es obligatorio'),
      websiteUrl: Yup.string().trim().required('Este campo es obligatorio'),
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
    companyRole: Yup.string().trim().required('Este campo es obligatorio'),
  }),
];

const schemas = mergeSchemas(validationSchemas);

enum CONFIG {
  COMPANY_STEP = 0,
  CONTACT_STEP = 1,
  LOADING_MODAL = 2,
  FEEDBACK_MODAL = 3,
}

export default function RegisterPage() {
  const [step, setStep] = useState(CONFIG.COMPANY_STEP);
  const router = useRouter();
  const { mutateAsync } = useCreateUser('clients');
  const { openPopup } = useWindowPopup();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[step],
    // eslint-disable-next-line consistent-return
    onSubmit: async (values, _formik) => {
      try {
        if (step < CONFIG.CONTACT_STEP) {
          return setStep(step + 1);
        }

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
    const payload = Buffer.from(JSON.stringify({ company: formik.values.company, userType: 'CLIENT' })).toString(
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
        {step === CONFIG.COMPANY_STEP && <AddCompanyForm isSubmitting={formik.isSubmitting} />}
        {step > CONFIG.COMPANY_STEP && (
          <AddContactStep
            onBackClick={() => setStep(CONFIG.COMPANY_STEP)}
            isSubmitting={formik.isSubmitting}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}
        {step === CONFIG.LOADING_MODAL && <LoadingModal />}
        {step === CONFIG.FEEDBACK_MODAL && (
          <FeedbackRegisterModal
            buttonText='Gestionar mis equipos'
            onClose={() => router.replace(`${process.env.NEXT_PUBLIC_CLIENTS_URL}`)}
            onFinish={() => router.replace(`${process.env.NEXT_PUBLIC_CLIENTS_URL}`)}
          />
        )}
      </Form>
    </FormikProvider>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await Promise.all([queryClient.prefetchQuery(GET_COUNTRIES, getCountries)]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
