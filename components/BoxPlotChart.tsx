
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Card } from './Card';
import { ChartIcon } from './icons';
import { BoxPlotData } from '../types';

interface BoxPlotChartProps {
  data: BoxPlotData;
}

// Recharts doesn't have a native Box Plot. We can simulate it with a Scatter chart and error bars.
export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({ data }) => {
  const plotData = [
    {
      x: 'Data',
      y: [data.min, data.q1, data.median, data.q3, data.max]
    }
  ];

  return (
    <Card title="Box Plot" icon={<ChartIcon />}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="x" tick={{ fill: '#A0AEC0' }} />
            <YAxis type="number" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#A0AEC0' }} />
            <ZAxis dataKey="y" range={[100, 100]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              wrapperStyle={{ zIndex: 100 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                    const values = payload[0].payload.y;
                    return (
                        <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg text-gray-200">
                            <p>Max: {values[4].toFixed(3)}</p>
                            <p>Q3: {values[3].toFixed(3)}</p>
                            <p>Median: {values[2].toFixed(3)}</p>
                            <p>Q1: {values[1].toFixed(3)}</p>
                            <p>Min: {values[0].toFixed(3)}</p>
                        </div>
                    );
                }
                return null;
            }}
            />
            <Scatter data={plotData} fill="#2DD4BF">
              {plotData.map((entry, index) => (
                <rect key={`box-${index}`} x={0} y={0} width={0} height={0} />
              ))}
            </Scatter>
             {/* Custom rendering for box plot components */}
            <g>
                {/* Box */}
                <rect x="35%" y={ (1 - (data.q3 - data.min) / (data.max-data.min)) * (300-40) + 20 } width="30%" height={ ((data.q3 - data.q1) / (data.max-data.min)) * (300-40) } stroke="#2DD4BF" fill="#2DD4BF" fillOpacity={0.3} />
                {/* Median line */}
                <line x1="35%" y1={ (1 - (data.median - data.min) / (data.max-data.min)) * (300-40) + 20 } x2="65%" y2={ (1 - (data.median - data.min) / (data.max-data.min)) * (300-40) + 20 } stroke="#F6AD55" strokeWidth={2} />
                {/* Top whisker */}
                <line x1="50%" y1={ (1 - (data.q3 - data.min) / (data.max-data.min)) * (300-40) + 20 } x2="50%" y2={ (1 - (data.max - data.min) / (data.max-data.min)) * (300-40) + 20 } stroke="#A0AEC0" />
                <line x1="40%" y1={ (1 - (data.max - data.min) / (data.max-data.min)) * (300-40) + 20 } x2="60%" y2={ (1 - (data.max - data.min) / (data.max-data.min)) * (300-40) + 20 } stroke="#A0AEC0" />
                {/* Bottom whisker */}
                <line x1="50%" y1={ (1 - (data.q1 - data.min) / (data.max-data.min)) * (300-40) + 20 } x2="50%" y2={ (1 - (data.min - data.min) / (data.max-data.min)) * (300-40) + 20 } stroke="#A0AEC0" />
                <line x1="40%" y1={ (1 - (data.min - data.min) / (data.max-data.min)) * (300-40) + 20 } x2="60%" y2={ (1 - (data.min - data.min) / (data.max-data.min)) * (300-40) + 20 } stroke="#A0AEC0" />
            </g>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
