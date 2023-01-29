import { images } from '@wimet/apps-shared';
import * as S from './SummarySection.styles';

const IconTypes = {
  star: <images.StarSolid />,
  building: <images.Building />,
  location: <images.LocationGroup />,
};

const InfoCard = ({
  text,
  iconName = 'location',
  $isColumn = false,
  onClickButton,
}: {
  text?: string | JSX.Element;
  iconName?: 'star' | 'building' | 'location';
  $isColumn?: boolean;
  onClickButton?: (...args: unknown[]) => void;
}) => (
  <S.SummaryCardWrapper {...{ $isColumn }}>
    <S.InfoFloatingIcon />
    <S.InfoIcon>{IconTypes[iconName]}</S.InfoIcon>
    <S.Description className='info-card-text'>
      {text}
      <S.ActionButton onClick={onClickButton} className={$isColumn ? 'action-card-btn' : 'info-card-btn '}>
        Ver más
      </S.ActionButton>
    </S.Description>
  </S.SummaryCardWrapper>
);

export default InfoCard;
