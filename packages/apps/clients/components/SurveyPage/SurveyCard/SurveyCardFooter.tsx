import { images } from '@wimet/apps-shared';
import * as S from './SurveyCardFooter.styles';

export const SurveyCardFooter = ({
  onCopyLink,
  onSeeCharts,
  onDelete,
  disableDeleteIcon,
  disableSeeCharts,
}: {
  onCopyLink?: () => void;
  onSeeCharts?: () => void;
  onDelete?: () => void;
  disableDeleteIcon?: boolean;
  disableSeeCharts?: boolean;
}) => (
  <S.FooterContainer>
    <S.CustomButton onClick={onCopyLink} className='survey-secondary-button'>
      <S.CopyLinkIcon />
      Copiar el Link
    </S.CustomButton>
    <S.CustomButton onClick={onSeeCharts} className='survey-primary-button' disabled={disableSeeCharts}>
      <S.ChartIcon />
      Ver Resumen
    </S.CustomButton>
    <S.DeleteButton
      variant='tertiary'
      leadingIcon={<images.TinyBin />}
      onClick={onDelete}
      disabled={disableDeleteIcon}
    />
  </S.FooterContainer>
);

export default SurveyCardFooter;
