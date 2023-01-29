import { images } from '@wimet/apps-shared';
import * as S from './SurveyCard.styles';

export const SurveyCard = ({
  children,
  title,
  date,
  link,
  totalResponses,
}: {
  children?: JSX.Element;
  title?: string;
  date?: string;
  link?: string;
  totalResponses?: number | string;
}) => (
  <S.CardWrapper>
    <images.SurveyFolderIcon />
    <S.CardContent>
      <S.Title>{title}</S.Title>
      <S.Description>{date}</S.Description>
      <S.Description title={link} isLink>
        {link}
      </S.Description>
      <S.Description>Respuestas: {totalResponses}</S.Description>
      {children && children}
    </S.CardContent>
  </S.CardWrapper>
);
