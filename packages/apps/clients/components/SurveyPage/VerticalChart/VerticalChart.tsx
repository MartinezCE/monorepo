import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { datasetBaseConfig, optionsBaseConfig } from './config';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const VerticalChart = ({
  labels = [],
  data = [],
  xLabel,
  yLabel,
}: {
  labels?: (string | string[])[];
  data?: Array<number>;
  xLabel?: string;
  yLabel?: string;
}) => (
  <div>
    <Bar options={optionsBaseConfig(xLabel, yLabel)} data={{ labels, datasets: [{ ...datasetBaseConfig, data }] }} />
  </div>
);

export default VerticalChart;
