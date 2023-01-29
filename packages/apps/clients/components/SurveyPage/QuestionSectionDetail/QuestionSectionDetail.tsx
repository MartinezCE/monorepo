import PercentageInfoBanner from '../PercentageInfoBanner';
import ProgressBarList from '../ProgressBar/List';
import MultipleProgressBar from '../MultipleProgressBar';
import VerticalChart from '../VerticalChart';

import * as S from './QuestionSectionDetail.styles';

const parseLabelToFitChart = (string: string) => {
  if (string.length < 7) return string;

  const stringList = string.split(' ');
  const half = Math.ceil(stringList.length / 2);

  const firstHalf = stringList.slice(0, half).join(' ');
  const secondHalf = stringList.slice(half).join(' ');
  return [firstHalf, secondHalf];
};

type QuestionSectionDetailProps = {
  data: {
    topSummary: { info: string; percentage: string }[];
    data: {
      question: string;
      xLabel?: string;
      yLabel?: string;
      answers: { answer: string; total: number; yes: number; no: number }[];
      type: 'CHART' | 'PROGRESS' | 'MULTIPLE-PROGRESS';
    }[];
  };
};

const QuestionSectionDetail = ({ data }: QuestionSectionDetailProps) => (
  <S.QuestionSectionContainer>
    <PercentageInfoBanner percentages={data?.topSummary} />
    {data?.data.map(({ question, answers, type, xLabel, yLabel }) => (
      <S.QuestionContainer key={question}>
        <S.QuestionTitle>{question}</S.QuestionTitle>
        {type === 'CHART' && (
          <VerticalChart
            labels={answers.map(({ answer }) => parseLabelToFitChart(answer))}
            data={[...answers.map(({ total }) => total), 6]}
            xLabel={xLabel?.toUpperCase()}
            yLabel={yLabel?.toUpperCase()}
          />
        )}
        {type === 'PROGRESS' && (
          <ProgressBarList
            list={answers.map(({ answer, total }) => ({ label: answer, progress: total }))}
            type={answers.length > 9 ? 'column' : 'list'}
          />
        )}
        {type === 'MULTIPLE-PROGRESS' && (
          <MultipleProgressBar leftProgress={answers[0].yes} rightProgress={answers[0].no} />
        )}
      </S.QuestionContainer>
    ))}
  </S.QuestionSectionContainer>
);
export default QuestionSectionDetail;
