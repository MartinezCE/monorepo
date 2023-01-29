import { toast } from 'react-toastify';

const handlePopupListener = (
  e: MessageEvent<{ code: string; message?: string }>,
  onSuccess: () => void,
  onError?: () => void
) => {
  if (e.data?.code === 'auth-success') return onSuccess();
  if (e.data?.code === 'auth-fail')
    return onError?.() || toast.error(e.data.message || 'Hubo un error al autenticarse con Google');
  return null;
};

export const handleGoogleLogin = ({
  openPopup,
  onClose,
  onSuccess,
  onError,
}: {
  openPopup: (props: { customUrl?: string; onOpen?: () => void; onClose?: () => void }) => Window | null;
  onClose: () => void;
  onSuccess: () => void;
  onError?: () => void;
}) => {
  openPopup({
    customUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth/google/resources`,
    onOpen: () => window.addEventListener('message', e => handlePopupListener(e, onSuccess, onError)),
    onClose: () => {
      window.removeEventListener('message', e => handlePopupListener(e, onSuccess, onError));
      onClose();
    },
  });
};
