import { useRef } from 'react';

type Props = {
  width: number;
  height: number;
  url?: string;
};

type OpenPopupProps = {
  customUrl?: string;
  onOpen?: () => void;
  onClose?: () => void;
};

const useWindowPopup = ({ width, height, url }: Props = { width: 470, height: 580 }) => {
  const popupRef = useRef<Window | null>(null);

  const openPopup = ({ customUrl, onOpen, onClose }: OpenPopupProps = {}) => {
    const w = window.outerWidth - width;
    const h = window.outerHeight - height;
    const left = Math.round(window.screenX + w / 2);
    const top = Math.round(window.screenY + h / 2.5);

    const popup = window.open(
      customUrl || url,
      '',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0`
    );
    if (!popup) return null;
    popupRef.current = popup;

    onOpen?.();

    const popupInterval = setInterval(() => {
      if (!popup?.closed) return;
      clearInterval(popupInterval);
      onClose?.();
    }, 1000);

    return popup;
  };

  return { openPopup };
};

export default useWindowPopup;
