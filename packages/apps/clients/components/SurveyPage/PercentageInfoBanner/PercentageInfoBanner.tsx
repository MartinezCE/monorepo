/* eslint-disable react/no-array-index-key */
import * as S from './PercentageInfoBanner.styles';

export type PercentageCardProps = {
  percentage: number | string | null;
  info: string;
};

const PercentageInfoBanner = ({ percentages }: { percentages: PercentageCardProps[] }) => (
  <S.BannerWrapper>
    {percentages.map((p, i) => (
      <S.PercentageCard key={i}>
        <S.PercentageNumber>{p.percentage}%</S.PercentageNumber>
        <S.PercentageDetail>{p.info}</S.PercentageDetail>
      </S.PercentageCard>
    ))}
  </S.BannerWrapper>
);

export default PercentageInfoBanner;
