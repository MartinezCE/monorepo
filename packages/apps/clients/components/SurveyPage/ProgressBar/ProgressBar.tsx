import * as S from './ProgressBar.styles';

export type ProgressBarProps = {
  label?: string;
  progress?: number | string;
};

const ProgressBar = ({ label, progress }: ProgressBarProps) => (
  <S.Conatiner>
    {label && <S.Label>{label}</S.Label>}
    <S.ProgressWrapper>
      <div style={{ width: `${progress || 0}%` }} className='progress-bar' />
      <div className='progress-percentage'>{progress || 0}%</div>
    </S.ProgressWrapper>
  </S.Conatiner>
);

export default ProgressBar;
