import { CircularProgressBar, theme, images } from '@wimet/apps-shared';
import * as S from './SummarySection.styles';

const PercentageCard = ({
  $isColumn = false,
  progress,
  showCircle = false,
  text,
  icon,
  onClickButton,
}: {
  $isColumn?: boolean;
  progress?: number;
  showCircle?: boolean;
  text?: string | JSX.Element;
  icon?: JSX.Element;
  onClickButton?: () => void;
}) => (
  <S.SummaryCardWrapper {...{ $isColumn }}>
    {icon && icon}

    {showCircle ? (
      <S.CircularProgressContainer>
        <CircularProgressBar
          strokeWidth={11}
          value={progress}
          styles={{ trail: { stroke: theme.colors.lightGray }, path: { stroke: theme.colors.blue } }}
          showProgressText={true}>
          <S.ProgressNumber>{progress}%</S.ProgressNumber>
        </CircularProgressBar>
      </S.CircularProgressContainer>
    ) : (
      <S.ProgressContainer>
        <images.StarsGroup className='stars-group' />
        <S.ProgressNumber>{progress}%</S.ProgressNumber>
      </S.ProgressContainer>
    )}
    <S.DescriptionContainer>
      <S.Description className='percentage-card-text'>{text}</S.Description>
      <S.ActionButton onClick={onClickButton} className='percentage-card-btn'>
        Ver más
      </S.ActionButton>
    </S.DescriptionContainer>
  </S.SummaryCardWrapper>
);

export default PercentageCard;
