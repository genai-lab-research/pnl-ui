/** @jsxImportSource @emotion/react */
import React from 'react';
import { ChartConfig } from '../types';
import { useChartBars } from '../hooks';
import {
  chartStyles,
  chartHeaderStyles,
  chartTitleStyles,
  metricsContainerStyles,
  metricStyles,
  metricLabelStyles,
  metricValueStyles,
  chartContentStyles,
  chartGridStyles,
  gridLineStyles,
  barsContainerStyles,
  barStyles,
  labelsContainerStyles,
  labelStyles,
} from '../styles';

interface ChartSectionProps {
  chart: ChartConfig;
}

/**
 * ChartSection - Individual chart component displaying metrics with mini bar chart
 * 
 * Features:
 * - Responsive bar chart visualization
 * - Grid background for better readability
 * - Active day indicator
 * - Accessibility labels and ARIA support
 */
const ChartSection: React.FC<ChartSectionProps> = ({ chart }) => {
  const chartBars = useChartBars(chart.data);

  return (
    <section css={chartStyles} aria-labelledby={`chart-title-${chart.title}`}>
      {/* Chart Header */}
      <div css={chartHeaderStyles}>
        <h3 id={`chart-title-${chart.title}`} css={chartTitleStyles}>
          {chart.title}
        </h3>
        <div css={metricsContainerStyles}>
          <div css={metricStyles}>
            <span css={metricLabelStyles}>{chart.avgLabel}</span>
            <span css={metricValueStyles}>{chart.avgValue}</span>
          </div>
          {chart.totalLabel && chart.totalValue && (
            <div css={metricStyles}>
              <span css={metricLabelStyles}>{chart.totalLabel}</span>
              <span css={metricValueStyles}>{chart.totalValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div css={chartContentStyles}>
        {/* Background Grid Lines */}
        <div css={chartGridStyles} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              css={[gridLineStyles, { top: `${i * 16}px` }]}
            />
          ))}
        </div>

        {/* Bar Chart */}
        <div css={barsContainerStyles} role="img" aria-label={`${chart.title} bar chart`}>
          {chartBars.map((bar, index) => (
            <div
              key={`${bar.label}-${index}`}
              css={[
                barStyles,
                { 
                  height: `${bar.height}px`,
                  backgroundColor: chart.color,
                  opacity: bar.isActive ? 1 : 0.7
                }
              ]}
              className={bar.isActive ? 'active' : ''}
              aria-label={`${bar.label}: ${bar.value}`}
            />
          ))}
        </div>

        {/* Day Labels */}
        <div css={labelsContainerStyles}>
          {chart.data.map((item, index) => (
            <span key={`${item.label}-${index}`} css={labelStyles}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChartSection;