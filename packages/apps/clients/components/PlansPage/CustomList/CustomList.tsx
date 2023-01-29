import { Label } from '@wimet/apps-shared';
import styled from 'styled-components';
import type { List } from '../../../pages/pass/plans/list';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 0 10px;
  gap: 30px;
`;

const StyledItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  > div:first-child {
    display: flex;
    min-width: 40px;
    background: rgba(220, 231, 255, 1);
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    height: 50px;
  }
  > div:last-child {
    display: flex;
    flex-direction: column;
  }
`;

const StyledCustomLabel = styled(Label)<{ isTitle?: boolean }>`
  color: ${({ isTitle }) => (isTitle ? 'rgba(0, 43, 143, 1)' : 'rgba(44, 48, 56, 1)')};
`;

type Props = {
  list: List;
};

export default function CustomList({ list }: Props) {
  return (
    <StyledWrapper>
      {list.title && <StyledCustomLabel isTitle text={list.title} lowercase size='xlarge' variant='tertiary' />}
      {list.items.map(item => (
        <StyledItemContainer key={item.title}>
          <div>{item.icon}</div>
          <div>
            <StyledCustomLabel text={item.title} lowercase size='xlarge' />
            <p>{item.description}</p>
          </div>
        </StyledItemContainer>
      ))}
    </StyledWrapper>
  );
}
