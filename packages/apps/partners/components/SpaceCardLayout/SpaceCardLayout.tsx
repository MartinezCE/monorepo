import Image from 'next/image';
import styled from 'styled-components';
import {
  Label,
  Button,
  images,
  BlueprintStatus,
  LocationStatus,
  StatusBadge,
  ForwardLink,
  Link,
} from '@wimet/apps-shared';
import { ButtonIconBinMixin, ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';

const StyledWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 18px;
  height: 134px;
  display: grid;
  grid-template-columns: 160px repeat(4, minmax(0, 1fr));
  column-gap: 24px;
`;

const StyledImageWrapper = styled.div`
  position: relative;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledSecondLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  margin-top: 4px;
`;

const StyledThirdLabel = styled(StyledSecondLabel)`
  margin-top: 14px;
`;

type StyledStatusWrapperProps = {
  statusFullWidth: boolean;
};
const StyledStatusWrapper = styled.div<StyledStatusWrapperProps>`
  display: flex;
  flex-direction: column;
  align-self: center;
  row-gap: 12px;
  align-items: center;
  width: ${({ statusFullWidth }) => (statusFullWidth ? '100%' : 'fit-content')};
`;

const StyledStatusInnerWrapper = styled.div`
  display: flex;
  column-gap: 16px;
  align-items: center;
`;

const StyledStatusProgress = styled(Label)`
  color: ${({ theme }) => theme.colors.gray};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledButtonWrapper = styled.div<{ addSpace: boolean }>`
  display: flex;
  column-gap: 12px;
  align-self: center;
  justify-content: flex-end;
  height: fit-content;
  margin-right: ${({ addSpace }) => (addSpace ? '24px' : '0')};
`;

const StyledButtonIcon = styled(Button)`
  ${ButtonIconMixin};
`;

const StyledLinkIcon = styled(Link)`
  ${ButtonIconMixin};
`;

const StyledButtonIconBin = styled(StyledButtonIcon)`
  ${ButtonIconBinMixin};
`;

const StyledChildrenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

type Props = {
  image?: string;
  spaceTitle: string;
  spaceSubtitle: string;
  spaceSecondSubtitle?: string;
  status: LocationStatus | BlueprintStatus;
  statusText: string;
  percentageCompleted?: number;
  onShowDetails?: () => void;
  onDuplicate?: () => void;
  onEditHref?: string;
  onCompleteInfoHref?: string;
  onDelete?: () => void;
  addActionsSpace?: boolean;
  statusFullWidth?: boolean;
  children?: React.ReactNode;
};

export default function SpaceCardLayout({
  image,
  spaceTitle,
  spaceSubtitle,
  spaceSecondSubtitle,
  status,
  statusText,
  percentageCompleted,
  onShowDetails,
  onDuplicate,
  onEditHref,
  onCompleteInfoHref = '',
  onDelete,
  children,
  statusFullWidth = false,
  addActionsSpace = false,
}: Props) {
  return (
    <StyledWrapper>
      <StyledImageWrapper>
        <StyledImage src={image || '/images/placeholder.png'} layout='fill' objectFit='cover' objectPosition='center' />
      </StyledImageWrapper>
      <StyledTextWrapper>
        <Label text={spaceTitle} variant='currentColor' size='xlarge' lowercase />
        <StyledSecondLabel text={spaceSubtitle} variant='currentColor' lowercase />
        {spaceSecondSubtitle && <StyledThirdLabel text={spaceSecondSubtitle} variant='tertiary' lowercase />}
      </StyledTextWrapper>
      <StyledChildrenWrapper>{children}</StyledChildrenWrapper>
      <StyledStatusWrapper statusFullWidth={statusFullWidth}>
        <StyledStatusInnerWrapper>
          <StatusBadge variant={status}>{statusText}</StatusBadge>
          {percentageCompleted && <StyledStatusProgress text={`${percentageCompleted}% completo`} lowercase />}
        </StyledStatusInnerWrapper>
        {onCompleteInfoHref && <ForwardLink href={onCompleteInfoHref} />}
      </StyledStatusWrapper>
      <StyledButtonWrapper addSpace={addActionsSpace}>
        {onShowDetails && (
          <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyEye />} onClick={onShowDetails} />
        )}
        {onDuplicate && (
          <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyDuplicate />} onClick={onDuplicate} />
        )}
        {onEditHref && <StyledLinkIcon variant='secondary' leadingIcon={<images.TinyEdit />} href={onEditHref} />}
        {onDelete && <StyledButtonIconBin variant='secondary' leadingIcon={<images.TinyBin />} onClick={onDelete} />}
      </StyledButtonWrapper>
    </StyledWrapper>
  );
}
