import React from 'react';
import styled from 'styled-components';
import { Label, Link, pluralize } from '@wimet/apps-shared';

const StyledTextWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 24px;
  justify-content: center;
  align-items: center;
`;

const StyledDetailItem = styled.div<{ isLastItem?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: ${({ isLastItem }) => (isLastItem ? '6px' : '0px')};
`;

const StyledDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const StyledLinkWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const StyledLabel = styled(Label)`
  font-weight: 200;
`;

type StyledIndicatorProps = {
  avaliable: boolean;
};
const StyledIndicator = styled.div<StyledIndicatorProps>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: ${({ theme, avaliable }) => (avaliable ? theme.colors.success : theme.colors.gray)};
  margin-right: 6px;
`;

type Props = {
  avaliable?: number;
  occupied?: number;
  href?: string;
};

const BlueprintDetailsItem = ({ avaliable, occupied, href }: Props) => (
  <StyledTextWrapper>
    <StyledLinkWrapper>
      <Link variant='transparent' href={href}>
        {avaliable ? 'Ver plano' : 'Completar plano'}
      </Link>
    </StyledLinkWrapper>
    {!!avaliable && (
      <StyledDetailsWrapper>
        <StyledDetailItem>
          <StyledIndicator avaliable />
          <StyledLabel
            text={occupied ? `${pluralize(avaliable, 'disponible', true)}` : `${avaliable} en total`}
            variant='currentColor'
            lowercase
          />
        </StyledDetailItem>
        {!!occupied && (
          <StyledDetailItem isLastItem>
            <StyledIndicator avaliable={false} />
            <StyledLabel text={`${pluralize(occupied, 'bloqueado', true)}`} variant='currentColor' lowercase />
          </StyledDetailItem>
        )}
      </StyledDetailsWrapper>
    )}
  </StyledTextWrapper>
);

export default BlueprintDetailsItem;
