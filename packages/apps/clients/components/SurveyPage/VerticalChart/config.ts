import { Align } from 'chart.js';
import { theme } from '@wimet/apps-shared';

const tickStyles = {
  font: {
    size: 12,
    weight: '300',
  },
  color: theme.colors.darkBlue,
  padding: 20,
};

const labelTitleStyles = {
  display: true,
  align: 'start' as Align,
  color: theme.colors.blue,
  font: {
    size: 12,
    weight: '500',
  },
};

export const optionsBaseConfig = (xLabel?: string, yLabel?: string) => ({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: tickStyles,
      title: {
        ...labelTitleStyles,
        text: xLabel || 'OPCIONES >',
      },
    },
    y: {
      grid: {
        drawBorder: false,
        borderDash: [8, 8],
        borderDashOffset: 5,
        circular: true,
      },
      ticks: {
        ...tickStyles,
        padding: 30,
      },
      title: {
        ...labelTitleStyles,
        text: yLabel || 'CANTIDAD DE RESPUESTAS  >',
      },
    },
  },
});

export const datasetBaseConfig = {
  backgroundColor: theme.colors.blue,
  hoverBackgroundColor: theme.colors.darkBlue,
  barThickness: 24,
  maxBarThickness: 24,
  borderRadius: 100,
  base: 0,
  pointStyle: 'dash',
  borderSkipped: false,
};
