/* eslint-disable react/no-array-index-key */
import React, { useRef } from 'react';
import styled from 'styled-components';
import { images, Pill } from '@wimet/apps-shared';

const StyledWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const StyledTitle = styled.div`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  margin-bottom: 12px;
`;

const StyledSubtitle = styled.div`
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: 200;
  font-size: 16px;
  line-height: 24px;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
`;
const StyledArrow = styled(images.LightChevronRight)`
  color: ${({ theme }) => theme.colors.darkGray};
`;

const StyledPill = styled(Pill)``;

const StyledPillArea = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 18px;
  & > ${StyledPill} {
    margin-right: 16px;
  }

  & > ${StyledPill}:last-child {
    margin-right: 0;
  }
`;

type SelectedData = {
  id: number;
  name: string;
};

type Props = {
  title: string;
  subtitle: string;
  selectedData?: Array<SelectedData>;
  onClick: () => void;
};

const FilterPageOption = ({ title, subtitle, onClick, selectedData = [] }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handlePageOptionClick = (e: React.SyntheticEvent<EventTarget>) => {
    if (!(ref && ref.current?.contains(e.target as HTMLInputElement))) {
      onClick();
    }
  };

  const showPillArea = selectedData && selectedData.length > 0;

  return (
    <StyledWrapper onClick={handlePageOptionClick}>
      <StyledTextWrapper>
        <StyledTitle>{title}</StyledTitle>
        {!showPillArea && <StyledSubtitle>{subtitle}</StyledSubtitle>}
        {showPillArea && (
          <StyledPillArea ref={ref}>
            {selectedData.map(singleData => (
              <StyledPill key={singleData.id} onClickClose={() => {}} text={singleData.name} />
            ))}
          </StyledPillArea>
        )}
      </StyledTextWrapper>
      <StyledArrow />
    </StyledWrapper>
  );
};

export default FilterPageOption;
