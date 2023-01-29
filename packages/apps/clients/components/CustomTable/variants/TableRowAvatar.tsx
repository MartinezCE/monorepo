import { Profile } from '@wimet/apps-shared';
import styled from 'styled-components';

const ContainerData = styled.div`
  display: flex;
  align-items: center;
  .container {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }
  .title {
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    color: #101828;
  }
  .subTitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #667085;
  }
`;

type PropsAvatar = {
  title: string | undefined;
  subtitle?: string | undefined;
  avatarUrl?: string | undefined;
};

const TableRowAvatar = ({ title, subtitle, avatarUrl }: PropsAvatar) => (
  <ContainerData>
    <Profile showUserLabel={false} variant={avatarUrl ? 'transparent' : 'gray'} borderWidth={1} image={avatarUrl} />
    <div className='container'>
      <span className='title'>{title}</span>
      {subtitle && <span className='subTitle'>{subtitle}</span>}
    </div>
  </ContainerData>
);
export default TableRowAvatar;
