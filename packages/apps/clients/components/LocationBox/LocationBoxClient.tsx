import React, { ReactNode } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
  Text,
  Label,
  Link,
  Button,
  LocationStatus,
  getStatusLabel,
  SpaceTypeEnum,
  getSpaceTypeLabel,
  StatusBadge,
  Floor,
  Tooltip,
  LocationFile,
  ForwardLink,
} from '@wimet/apps-shared';
import { ButtonIconBinMixin, ButtonIconMixin } from '@wimet/apps-shared/lib/common/mixins';
import { Door, Monitor, Qr, TinyBin, TinyEdit, TinyStaff } from '@wimet/apps-shared/lib/assets/images';

const StyledWrapper = styled.div<{ status: LocationStatus }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  width: 494px;
  height: 185px;
  display: grid;
  grid-template-columns: 50% 50%;
  position: relative;
  margin-bottom: auto;
  padding-bottom: ${({ status }) => status === LocationStatus.IN_PROCESS && '20px'};
  margin-bottom: auto;
`;

const StyledHeader = styled(Link)`
  min-height: 124px;
  display: flex;
  position: relative;
  height: max-content;
  padding-top: 32px;
  align-items: flex-start;
  justify-content: start;
  flex-direction: column;

  > * {
    z-index: 1;
  }

  &::after {
    content: '';
    // background: ${({ theme }) => theme.colors.extraLightBlue};
    background: white;
    height: 100%;
    width: 200%;
    transform: translate(-50%);
    border-radius: 8px;
    position: absolute;
    top: 0;
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px;
  grid-area: 1 / 1 / 3 / 2;
  pointer-events: none;
`;

const StyledImageContent = styled.div`
  position: relative;
  width: 197px;
  height: 137px;
  border-radius: 4px;
  overflow: hidden;
`;

const StyledTextBold = styled(Text)`
  font-weight: ${({ theme }) => theme.fontWeight[3]};
`;

const StyledFlexContainer = styled.div`
  display: flex;
`;

const StyledAddressContainer = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
  font-weight: ${({ theme }) => theme.fontWeight[1]};
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  align-items: flex-end;
  padding: 0 0 34px 0;
`;

const StyledRightBottomContainer = styled.div`
  display: flex;
  column-gap: 16px;
`;

const StyledTooltip = styled(Tooltip)`
  margin-top: 10px;
  opacity: 0;
`;

const StyledInfoBox = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  display: flex;
  align-items: center;
  cursor: default;
  position: relative;

  p {
    margin-left: 10px;
  }

  &:not(:last-child) {
    margin-right: 32px;
  }

  :hover ${StyledTooltip} {
    opacity: 1;
  }
`;

const StyledLinkIcon = styled(Link)`
  ${ButtonIconMixin};
`;

const StyledButtonIconBin = styled(Button)`
  ${ButtonIconMixin};
  ${ButtonIconBinMixin};
`;

const StyledButtonIconQr = styled(Button)`
  ${ButtonIconMixin};
  ${ButtonIconMixin};
`;

const StyledBadgeContainer = styled.div`
  position: absolute;
  top: 0;
  right: 40px;
  transform: translateY(-50%);
  z-index: 3;
`;

const StyledUnfinishedBadge = styled(StatusBadge)`
  background-color: ${({ theme }) => theme.colors.lightBlue};
`;

const StyledProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledProgressLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledForwardLink = styled(ForwardLink)`
  margin-top: 4px;
`;

const config: { [k in SpaceTypeEnum]: JSX.Element } = {
  MEETING_ROOM: <Monitor />,
  PRIVATE_OFFICE: <Door />,
  SHARED: <TinyStaff />,
};

type LeftFooterAction = {
  text: string;
  icon: ReactNode;
};

type LocationBoxProps = {
  id: number;
  status: LocationStatus;
  locationFiles: {
    [key: string]: LocationFile[];
  };
  address?: string;
  percentage: number;
  spaceCount?: {
    spaceTypeId: number;
    value: SpaceTypeEnum;
    count: number;
  }[];
  showCardHref?: boolean;
  cardHref?: string;
  cardHrefTitle?: string;
  editHref?: string;
  completeInfoHref: string;
  leftFooterActions?: LeftFooterAction[];
  name?: string;
  onDelete: () => void;
  onClickQr?: () => void;
  progressPosition?: 'center' | 'bottom left';
  locationFloor?: Floor[];
};

const LocationBoxClient: React.FC<LocationBoxProps> = ({
  id,
  status,
  locationFiles,
  address,
  percentage,
  spaceCount,
  editHref,
  completeInfoHref,
  leftFooterActions,
  showCardHref = true,
  cardHref,
  cardHrefTitle,
  name,
  onDelete,
  onClickQr,
  progressPosition = 'center',
  locationFloor,
}) => {
  // TODO: Remove actions from LocationBox and pass parameters instead
  const progress = status === LocationStatus.IN_PROCESS && (
    <StyledProgressWrapper>
      <StyledProgressLabel
        text={`${Math.floor(percentage * 100)}% completo`}
        variant='secondary'
        size='small'
        lowercase
      />
      <StyledForwardLink href={completeInfoHref} />
    </StyledProgressWrapper>
  );

  return (
    <StyledWrapper status={status}>
      <StyledBadgeContainer>
        {status === LocationStatus.IN_PROCESS ? (
          <StyledUnfinishedBadge variant={status}>{getStatusLabel(status)}</StyledUnfinishedBadge>
        ) : (
          <StatusBadge variant={status}>{getStatusLabel(status)}</StatusBadge>
        )}
      </StyledBadgeContainer>
      <StyledImageContainer>
        <StyledImageContent>
          <Image
            src={locationFiles.images?.[0].url || '/images/placeholder.png'}
            layout='fill'
            objectFit='cover'
            objectPosition='center'
          />
        </StyledImageContent>
      </StyledImageContainer>
      <StyledHeader href={cardHref || `/locations/${id}`} noBackground>
        <StyledFlexContainer>
          <StyledTextBold variant='large'>{name}</StyledTextBold>
          {/* <Text variant='large'>{data.country}</Text> */}
        </StyledFlexContainer>
        <StyledAddressContainer>{address?.split(',')[0]}</StyledAddressContainer>
        {showCardHref && (
          <StyledForwardLink href={cardHref || `/locations/${id}`} showTrailingIcon={false}>
            {cardHrefTitle || 'Ver espacios'}
          </StyledForwardLink>
        )}
      </StyledHeader>
      {progressPosition === 'center' && progress}
      <StyledFooter>
        <StyledFlexContainer>
          {progressPosition === 'bottom left' && progress}
          {spaceCount?.map(item => (
            <StyledInfoBox key={item.value}>
              {config[item.value]}
              <Text>{item.count}</Text>
              <StyledTooltip>{getSpaceTypeLabel(item.value)}</StyledTooltip>
            </StyledInfoBox>
          ))}
          {leftFooterActions?.map(item => (
            <StyledInfoBox key={item.text}>
              {item.icon}
              <Text>{item.text}</Text>
            </StyledInfoBox>
          ))}
        </StyledFlexContainer>
        <StyledRightBottomContainer>
          <StyledButtonIconQr
            variant='secondary'
            disabled={locationFloor && !(locationFloor?.length > 0)}
            leadingIcon={<Qr />}
            onClick={onClickQr}
          />

          {status !== LocationStatus.IN_PROCESS && (
            <StyledLinkIcon variant='secondary' leadingIcon={<TinyEdit />} href={editHref} />
          )}
          <StyledButtonIconBin variant='secondary' leadingIcon={<TinyBin />} onClick={onDelete} />
        </StyledRightBottomContainer>
      </StyledFooter>
    </StyledWrapper>
  );
};

export default LocationBoxClient;
