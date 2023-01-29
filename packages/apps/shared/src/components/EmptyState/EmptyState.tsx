import * as S from './EmptyState.styles';
import { images } from '../../assets';

const EmptyState = ({ title, subtitle }: { title?: string; subtitle?: string }) => (
  <S.EmptyStateWrapper>
    <images.BlueSearchIcon />
    {title && <p className='empty-state__title'>{title}</p>}
    {subtitle && <p className='empty-state__subtitle'>{subtitle}</p>}
  </S.EmptyStateWrapper>
);

export default EmptyState;
