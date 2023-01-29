import { useState } from 'react';

const useModal = <T, R>() => {
  const [showModal, setShowModal] = useState<{ type?: T; removeItem?: R }>({});

  const handleOpenModal = (type: T, removeItem?: R) => setShowModal({ type, removeItem });
  const handleCloseModal = () => setShowModal({});

  return {
    showModal,
    modalType: showModal.type,
    removeItem: showModal.removeItem,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useModal;
