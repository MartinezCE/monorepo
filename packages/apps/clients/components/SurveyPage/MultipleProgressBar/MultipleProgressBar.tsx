import * as S from './MultipleProgressBar.styles';

type MultipleProgressBarProps = {
  leftLabel?: string;
  rightLabel?: string;
  leftProgress?: number | string;
  rightProgress?: number | string;
  // totalBase?: number | string;
};

const MultipleProgressBar = ({
  leftLabel = 'Sí',
  rightLabel = 'No',
  leftProgress,
  rightProgress,
}: // totalBase = 100,
MultipleProgressBarProps) => (
  <S.Container>
    <S.InfoWrapper>
      <S.InfoText className='info-text bullet-blue'>{leftLabel}</S.InfoText>
      <S.InfoText className='info-text bullet-green'>{rightLabel}</S.InfoText>
      <S.Divider />
    </S.InfoWrapper>
    <S.MultipleProgressWrapper>
      <S.ProgressBar className='blue-bar' style={{ width: `${leftProgress}%` }}>
        {leftProgress}%
      </S.ProgressBar>
      {!!rightProgress && (
        <S.ProgressBar className='green-bar' style={{ width: `${rightProgress}%` }}>
          {rightProgress}%
        </S.ProgressBar>
      )}
    </S.MultipleProgressWrapper>
  </S.Container>
);

export default MultipleProgressBar;
