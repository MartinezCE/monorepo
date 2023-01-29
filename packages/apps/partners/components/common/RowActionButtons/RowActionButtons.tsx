import { Button, images, mixins } from '@wimet/apps-shared';
import styled from 'styled-components';

const StyledButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;
  padding-top: 22px;
  height: fit-content;
`;

const StyledButtonIcon = styled(Button)`
  ${mixins.ButtonIconMixin};
`;

const StyledButtonIconMore = styled(StyledButtonIcon)`
  ${mixins.ButtonIconBinMixin};
`;

type Props = {
  className?: string;
  showDuplicate?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
};

export default function RowActionButtons({
  className,
  showDuplicate = true,
  showDelete = true,
  showAdd = true,
  onDuplicate,
  onDelete,
  onAdd,
}: Props) {
  return (
    <StyledButtonWrapper className={className}>
      {showDuplicate && (
        <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyDuplicate />} onClick={onDuplicate} />
      )}
      {showDelete && <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyBin />} onClick={onDelete} />}
      {showAdd && <StyledButtonIconMore variant='secondary' leadingIcon={<images.TinyMore />} onClick={onAdd} />}
    </StyledButtonWrapper>
  );
}
