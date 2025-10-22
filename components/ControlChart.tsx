
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from './Card';
import { ChartIcon } from './icons';
import { ControlChartData } from '../types';

interface ControlChartProps {
  data: ControlChartData;
}

export const ControlChart: React.FC<ControlChartProps> = ({ data }) => {
    const { points, cl, ucl, lcl } = data;

    const outOfControlPoints = points.filter(p => p.mean > ucl || p.mean < lcl);

    return (
        <Card title="X-bar Control Chart" icon={<ChartIcon />}>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={points} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="subgroup" tick={{ fill: '#A0AEC0' }} label={{ value: 'Subgroup', position: 'insideBottom', offset: -5, fill: '#A0AEC0' }}/>
                        <YAxis tick={{ fill: '#A0AEC0' }} domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748', color: '#CBD5E0' }}
                            labelStyle={{ color: '#E2E8F0' }}
                        />
                        <Legend wrapperStyle={{color: '#E2E8F0'}} />
                        <ReferenceLine y={ucl} label={{ value: `UCL=${ucl.toFixed(3)}`, fill: '#F56565' }} stroke="#F56565" strokeDasharray="3 3" />
                        <ReferenceLine y={lcl} label={{ value: `LCL=${lcl.toFixed(3)}`, fill: '#F56565' }} stroke="#F56565" strokeDasharray="3 3" />
                        <ReferenceLine y={cl} label={{ value: `CL=${cl.toFixed(3)}`, fill: '#48BB78' }} stroke="#48BB78" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="mean" stroke="#38B2AC" strokeWidth={2} name="Subgroup Mean" />
                        {outOfControlPoints.map((p, index) => (
                            <ReferenceLine key={index} x={p.subgroup} stroke="red"  />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {outOfControlPoints.length > 0 && 
                <p className="text-center text-sm text-red-400 mt-2">
                    {outOfControlPoints.length} point(s) out of control limits.
                </p>
            }
        </Card>
    );
};
