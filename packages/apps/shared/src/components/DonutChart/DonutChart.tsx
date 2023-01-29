import dynamic from 'next/dynamic';
import styled from 'styled-components';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const options = {
  colors: ['rgba(234, 234, 234, 1)', 'rgba(234, 234, 234, 1)', 'rgba(234, 234, 234, 1)'],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
};

const StyledWrapper = styled.div`
  display: flex;
  position: relative;
`;

const StyledChartTitle = styled.p`
  display: flex;
  position: absolute;
  top: 50px;
  left: 44px;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.darkBlue};
`;

export default function DonutChart({
  title,
  series,
  labels,
  colors,
}: {
  title: string;
  series: number[];
  labels: string[];
  colors?: string[];
}) {
  return (
    <StyledWrapper>
      <Chart options={{ ...options, labels, fill: { colors } }} series={series} type='donut' width={150} height={150} />
      <StyledChartTitle>{title}</StyledChartTitle>
    </StyledWrapper>
  );
}
