import { getSpaceTypeLabel, Text, Space, BreakpointBox } from '@wimet/apps-shared';
import styled from 'styled-components';
import CreditsInfoBadge from '../../CreditsInfoBadge';
import { Layout } from '../../mixins';

const StyledWrapper = styled.div`
  ${Layout}
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  width: 100%;
  margin-top: 56px;
  margin-bottom: 48px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    > p {
      display: none;
    }
  }
`;

const StyledHeader = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: auto 30px 1fr auto;
  // column-gap: 32px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: auto;
    align-items: flex-start;
    justify-content: flex-start;
    grid-template-columns: 50% auto;
    column-gap: 70px;
  }
`;

const StyledTitle = styled.h4`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const StyledSubtitle = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.darkBlue};
`;

type Props = {
  space: Partial<Space>;
  onClickDiscounts?: () => void;
};

export default function SpaceDetailsHeader({ space, onClickDiscounts }: Props) {
  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledTitle>
          {space.name}
          <BreakpointBox initialDisplay='none' breakpoints={{ md: 'flex' }}>
            <StyledSubtitle>
              {space.spaceType && <StyledText variant='large'>{getSpaceTypeLabel(space?.spaceType?.value)}</StyledText>}
            </StyledSubtitle>
          </BreakpointBox>
        </StyledTitle>
        <BreakpointBox initialDisplay='none' breakpoints={{ md: 'flex' }}>
          <CreditsInfoBadge space={space} onClickDiscounts={onClickDiscounts} />
        </BreakpointBox>
        <BreakpointBox initialDisplay='flex' breakpoints={{ md: 'none' }}>
          <div> </div>
        </BreakpointBox>
        <BreakpointBox initialDisplay='flex' breakpoints={{ md: 'none' }}>
          <StyledSubtitle>
            {space.spaceType && <StyledText variant='large'>{getSpaceTypeLabel(space?.spaceType?.value)}</StyledText>}
          </StyledSubtitle>
        </BreakpointBox>
        <BreakpointBox initialDisplay='flex' breakpoints={{ md: 'none' }}>
          <CreditsInfoBadge space={space} onClickDiscounts={onClickDiscounts} />
        </BreakpointBox>
      </StyledHeader>
      {space.spaceType && <StyledText variant='large'>{getSpaceTypeLabel(space?.spaceType?.value)}</StyledText>}
    </StyledWrapper>
  );
}
