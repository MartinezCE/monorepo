import * as S from './ToggleSection.styles';

type ToggleSectionProps = {
  title: string;
  children?: JSX.Element;
  isExpanded?: boolean;
  key?: string | number;
  onClick?: (...param: []) => void;
};

const ToggleSection = ({ title, children, isExpanded = false, key, onClick }: ToggleSectionProps) => (
  <div key={key}>
    <S.HeaderWrapper onClick={onClick}>
      <p className='toggle-text'>{title}</p>
      <S.ChevronIcon className={isExpanded && 'chevron-up'} />
    </S.HeaderWrapper>
    <S.ContentWrapper
      {...(isExpanded && {
        className: 'toggle-content-expanded',
      })}>
      {children && children}
    </S.ContentWrapper>
  </div>
);

export default ToggleSection;
