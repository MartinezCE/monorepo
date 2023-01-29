/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import Label from '../Label';
import Button from '../Button';
import { images } from '../../assets';
import { BlueprintStatus, LocationStatus } from '../../utils';
import StatusBadge from '../StatusBadge';
import ForwardLink from '../ForwardLink';
import { ButtonIconMixin, ButtonIconBinMixin } from '../../common/mixins';
import Link from '../Link';

const StyledWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 18px;
  height: 96px;
`;

const StyledTextWrapper = styled.div`
  margin: 0px;
  width: 488px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledSecondLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  font-size: 14px !important;
  margin-top: 2px;
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
  margin-left: 50%;
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

const StyleButton = styled.button`
  margin-left: 16px;
  border: 1px solid #2c3038;
  border-radius: 4px;
  width: 72px;
  height: 28px;
  background: white;
  cursor: pointer;

  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;
type Props = {
  spaceTitle: string;
  // eslint-disable-next-line react/no-unused-prop-types
  spaceSubtitle?: string;
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
  countSeats?: any;
  handleClickDetails?: () => void;
};

export default function SpaceCardLayout({
  spaceTitle,
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
  countSeats,
  handleClickDetails,
}: Props) {
  return (
    <StyledWrapper>
      <StyledTextWrapper>
        <Label text={spaceTitle} variant='currentColor' size='xlarge' lowercase />
        {countSeats && (
          <StyledSecondLabel
            text={`${countSeats.countDeskt} Escritorios | ${countSeats.countMeeting}  Salas de juntas | ${countSeats.countPrivate}  Oficinas privadas`}
            variant='currentColor'
            lowercase
          />
        )}
        {spaceSecondSubtitle && <StyledThirdLabel text={spaceSecondSubtitle} variant='tertiary' lowercase />}
      </StyledTextWrapper>
      <StyledStatusWrapper statusFullWidth={statusFullWidth}>
        <StyledStatusInnerWrapper>
          <StatusBadge variant={status}>{statusText}</StatusBadge>
          {percentageCompleted && <StyledStatusProgress text={`${percentageCompleted}% completo`} lowercase />}
          <StyleButton type='button' onClick={handleClickDetails}>
            Detalles
          </StyleButton>
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
