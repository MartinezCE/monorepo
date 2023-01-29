import * as S from './InfoBanner.styles';

const InfoBanner = ({ info, status = 'info' }: { info: string; status?: 'info' }) => (
  <S.InfoBannerWrapper className={status}>
    <S.StyledIcon className={`info-banner__icon ${status}`} />
    <p className='info-banner__text'>{info}</p>
  </S.InfoBannerWrapper>
);

export default InfoBanner;
