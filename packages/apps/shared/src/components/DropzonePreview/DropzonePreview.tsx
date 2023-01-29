import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import { images } from '../../assets';
import { CustomFile } from '../../hooks';
import Button from '../Button';
import DeleteBaseModal from '../DeleteBaseModal';

const StyledImageWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  min-width: 180px;
  min-height: 112px;
`;

const StyledButtonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  display: flex;
  column-gap: 8px;
`;

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.darkGray};
  background-color: ${({ theme }) => theme.colors.whiteWithOpacity};
  border-radius: 999px;
  padding: 3px;
  width: 24px;
  height: 24px;
  justify-content: center;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const StyledPreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

type Props<T> = {
  isRemovingFile?: boolean;
  handleRemove: (file?: Partial<T>) => Promise<unknown>;
  showEditButton?: boolean;
  handleEdit?: ((file?: Partial<T>) => Promise<unknown>) | ((file?: Partial<T>) => unknown);
  hideRemoveModal?: boolean;
  getPreview?: (file?: Partial<T>) => React.ReactNode;
  fallbackThumbnail?: string;
  className?: string;
  file?: Partial<T>;
  preview?: string;
};

const DropzonePreview = <T extends File & CustomFile>({
  getPreview,
  handleRemove,
  showEditButton,
  handleEdit,
  hideRemoveModal,
  fallbackThumbnail,
  isRemovingFile,
  className,
  file,
  preview,
}: Props<T>) => {
  const [showRemoveModal, setShowRemoveModal] = useState<{ open: boolean; file?: Partial<T> }>({
    open: false,
  });

  return (
    <>
      <StyledImageWrapper key={file?.id} className={className}>
        <StyledButtonWrapper>
          {showEditButton && (
            <StyledButton
              leadingIcon={<images.ExtraTinyEdit />}
              variant='fifth'
              onClick={() => handleEdit?.(file)}
              noBackground
            />
          )}
          <StyledButton
            leadingIcon={<images.TinyClose />}
            variant='fifth'
            onClick={() => (!hideRemoveModal ? setShowRemoveModal({ open: true, file }) : handleRemove?.(file))}
            noBackground
          />
        </StyledButtonWrapper>
        {getPreview?.(file) || (
          <StyledPreviewWrapper>
            {(file?.preview || preview || fallbackThumbnail) && (
              <Image
                src={file?.preview || preview || fallbackThumbnail}
                layout='fill'
                objectFit='cover'
                objectPosition='center'
              />
            )}
          </StyledPreviewWrapper>
        )}
      </StyledImageWrapper>
      {showRemoveModal?.open && (
        <DeleteBaseModal
          title='¿Eliminar imagen?'
          onClose={() => setShowRemoveModal({ open: false })}
          onCancel={() => setShowRemoveModal({ open: false })}
          onConfirm={async () => {
            await handleRemove?.(showRemoveModal?.file);
            setShowRemoveModal({ open: false });
          }}
          disableButton={isRemovingFile}
        />
      )}
    </>
  );
};

export default DropzonePreview;
