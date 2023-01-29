import { Button } from '@wimet/apps-shared';
import * as S from './TeamCreditsBanner.styles';

type TeamCreaditsBannerProps = {
  title: string;
  description: string;
  btnText: string;
  onClick?: () => void;
  leftComponent?: React.ReactElement;
  hideAction?: boolean;
};

const TeamCreditsBanner = ({
  title,
  description,
  btnText,
  leftComponent,
  onClick,
  hideAction = false,
}: TeamCreaditsBannerProps) => (
  <S.TeamCreditsWrapper>
    {leftComponent && leftComponent}
    <div className='team-credits-banner__info'>
      <p className='team-credits-banner__info--title'>{title}</p>
      <p className='team-credits-banner__info--description'>{description}</p>
    </div>
    {!hideAction && (
      <Button className='team-credits-banner__button' onClick={onClick}>
        {btnText}
      </Button>
    )}
  </S.TeamCreditsWrapper>
);

export default TeamCreditsBanner;
