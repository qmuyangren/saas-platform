import React from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { LineChartProps, BarChartProps, PieChartProps, AreaChartProps } from 'recharts';

interface ChartProps {
  type?: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  width?: number | string;
  height?: number;
  title?: string;
  xKey?: string;
  yKeys?: string[];
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

const defaultColors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

const Chart: React.FC<ChartProps> = ({
  type = 'line',
  data = [],
  width = '100%',
  height = 300,
  title,
  xKey = 'name',
  yKeys = ['value'],
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
}) => {
  const renderChart = () => {
    const commonProps = {
      width: typeof width === 'string' ? undefined : width,
      height,
      data,
    };

    const responsiveProps = {
      width: typeof width === 'string' ? '100%' : undefined,
      height,
    };

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer {...responsiveProps}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} />
              <YAxis />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {yKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...responsiveProps}>
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} />
              <YAxis />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {yKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...responsiveProps}>
            <PieChart {...commonProps}>
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={height / 2 - 20}
                fill="#8884d8"
                dataKey={yKeys[0]}
                nameKey={xKey}
                label
              >
                {data.map((entry, index) => (
                  <cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...responsiveProps}>
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} />
              <YAxis />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {yKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 4 }}>
      {title && <h3 style={{ marginBottom: 16 }}>{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default Chart;
