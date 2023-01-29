import axios, { AxiosError } from 'axios';

export type { AxiosError };

export const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL}` || '', withCredentials: true });

api.interceptors.request.use(config => {
  // eslint-disable-next-line no-param-reassign
  config.headers['x-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config;
});

api.interceptors.response.use(
  data => data,
  e => {
    const { code, config, isAxiosError, message, name, request, response } = e as AxiosError;
    const { data } = response || {};
    let newMessage = null;

    if (Array.isArray(data?.errors)) {
      newMessage = data.errors[0]?.msg || data.errors[0]?.message;
    } else {
      newMessage = data?.error || data?.message || data || message;
    }

    newMessage = newMessage || '¡Oh no! Ocurrió un error inesperado.';

    const newError = new Error(newMessage) as AxiosError;

    newError.code = code;
    newError.config = config;
    newError.isAxiosError = isAxiosError;
    newError.name = name;
    newError.request = request;
    newError.response = response;

    return Promise.reject(newError);
  }
);
