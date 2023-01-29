import { images } from '@wimet/apps-shared';
import styled from 'styled-components';

type GoBackTitleActionProps = {
  title: string | JSX.Element;
  onClick: () => void;
  className?: string;
};

const Container = styled.div`
  display: flex;
  column-gap: 8px;
  align-items: center;
  cursor: pointer;
`;

export const Title = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.extraDarkBlue};
  font-size: 24px;
`;

const GoBackIcon = styled(images.ChevronLeft)`
  color: ${({ theme }) => theme.colors.blue};
`;

const GoBackTitleAction = ({ title, onClick, className }: GoBackTitleActionProps) => (
  <Container onClick={onClick} className={className}>
    <GoBackIcon />
    <Title>{title}</Title>
  </Container>
);

export default GoBackTitleAction;
