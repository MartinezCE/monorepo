import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Avatar, images, Input, User } from '@wimet/apps-shared';

type CollapsibleProps = {
  $isCollapse: boolean;
};

const StyledAvatar = styled(Avatar)`
  border-radius: 50%;
  border: 1px solid transparent;
  > div {
    border: unset;
  }
`;

const StyledIconArrowRight = styled(images.ArrowRight)`
  width: 22px;
  height: 22px;
  cursor: pointer;
  transition: 0.2s linear all;
  & path {
    stroke-width: 1px;
  }
`;

const StyledSearchIcon = styled(images.Search)`
  padding: 14px 0 14px 24px;
  box-sizing: content-box;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledSearchIconContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  margin-bottom: 24px;
  padding-bottom: 24px;
  ${StyledSearchIcon} {
    padding: 0;
    cursor: pointer;
  }
`;

const StyledItemWrapper = styled.div<CollapsibleProps>`
  background-color: ${({ theme, $isCollapse }) => ($isCollapse ? 'transparent' : theme.colors.extraLightGray)};
  display: flex;
  padding: ${({ $isCollapse }) => ($isCollapse ? 0 : '12px 16px')};
  border-radius: ${({ $isCollapse }) => ($isCollapse ? '50%' : '4px')};
  align-items: center;
  cursor: pointer;
  ${({ $isCollapse }) =>
    !$isCollapse &&
    css`
      border: 1px solid transparent;
    `};
`;

const StyledCheckbox = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  width: 1px;
`;

const StyledWrapper = styled.div<CollapsibleProps>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 24px;
  padding-top: 0;
  overflow-x: hidden;
  overflow-y: auto;
  width: ${({ $isCollapse }) => ($isCollapse ? 82 : 324)}px;
  height: min-content;

  ${StyledCheckbox}:checked + ${StyledItemWrapper} {
    ${({ $isCollapse }) =>
      !$isCollapse
        ? css`
            border-color: ${({ theme }) => theme.colors.blue};
          `
        : css`
            ${StyledAvatar} {
              border-color: ${({ theme }) => theme.colors.blue};
            }
          `};
  }

  ${({ $isCollapse }) =>
    $isCollapse &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      ${StyledIconArrowRight} {
        transform: rotate(180deg);
      }
      ${StyledAvatar} {
        transition: 0.2s linear all;
      }
    `};
`;

const StyledListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const StyledName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: ${({ theme }) => theme.fontWeight[2]};
  margin-left: 16px;
`;

const StyledLabel = styled.label``;

const StyledSearchInput = styled(Input)`
  width: 100%;
  margin-bottom: 24px;
`;

const StyledTitle = styled.p<CollapsibleProps>`
  color: ${({ theme }) => theme.colors.blue};
  span {
    font-weight: ${({ theme }) => theme.fontWeight[2]};
    color: inherit;
  }
  text-align: ${({ $isCollapse }) => ($isCollapse ? 'center' : 'left')};
`;

const StyledArrowContainer = styled.div`
  margin-bottom: 24px;
`;

const StyledStickyContainer = styled.div`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  z-index: 1;
  padding-top: 24px;
`;

type MembersListProps = {
  label?: string;
  membersList?: User[];
  selectedMembers?: number[];
  onSelectMember?: (id: number) => void;
};

const MembersList: React.FC<MembersListProps> = ({
  label = 'Colegas',
  membersList = [],
  selectedMembers,
  onSelectMember,
}) => {
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <StyledWrapper $isCollapse={isCollapse || false}>
      <StyledStickyContainer>
        <StyledArrowContainer>
          <StyledIconArrowRight onClick={() => setIsCollapse(!isCollapse)} />
        </StyledArrowContainer>
        {isCollapse ? (
          <StyledSearchIconContainer>
            <StyledSearchIcon onClick={() => setIsCollapse(!isCollapse)} />
          </StyledSearchIconContainer>
        ) : (
          <StyledSearchInput placeholder='Buscar por nombre' name='search' leadingAdornment={<StyledSearchIcon />} />
        )}
        <StyledTitle $isCollapse={isCollapse || false}>
          {!isCollapse && <span>{label}</span>}
          {isCollapse ? <span>{membersList.length}</span> : ` (${membersList.length})`}
        </StyledTitle>
      </StyledStickyContainer>
      <StyledListWrapper>
        {membersList.map(item => (
          <StyledLabel key={item.id}>
            <StyledCheckbox
              type='checkbox'
              value={item.id}
              name='checked'
              onChange={() => onSelectMember?.(item.id)}
              checked={selectedMembers?.includes(item.id)}
            />
            <StyledItemWrapper $isCollapse={isCollapse || false}>
              <StyledAvatar variant='transparent' borderWidth={1} image={item.avatarUrl} size={34} />
              {!isCollapse && <StyledName>{`${item.firstName} ${item.lastName}`.trim()}</StyledName>}
            </StyledItemWrapper>
          </StyledLabel>
        ))}
      </StyledListWrapper>
    </StyledWrapper>
  );
};

export default MembersList;
