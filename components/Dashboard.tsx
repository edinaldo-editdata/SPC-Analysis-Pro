
import React from 'react';
import { AnalysisResult } from '../types';
import { StatsSummary } from './StatsSummary';
import { HistogramChart } from './HistogramChart';
import { BoxPlotChart } from './BoxPlotChart';
import { ControlChart } from './ControlChart';
import { Card } from './Card';
import { InfoIcon } from './icons';

interface DashboardProps {
    result: AnalysisResult;
    lsl: number | null;
    usl: number | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ result, lsl, usl }) => {
    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatsSummary basicStats={result.basicStats} capability={result.capability} />
            <HistogramChart 
                histogramData={result.histogram} 
                basicStats={result.basicStats}
                lsl={lsl} 
                usl={usl}
            />
            <BoxPlotChart data={result.boxPlot} />
            {result.controlChart ? (
                <ControlChart data={result.controlChart} />
            ) : (
                <Card title="X-bar Control Chart" icon={<InfoIcon />}>
                    <div className="text-center text-gray-400">
                        <p>Control chart could not be generated.</p>
                        <p className="text-sm mt-2">Please ensure you have provided enough data for at least two subgroups and a valid subgroup size (2-10).</p>
                    </div>
                </Card>
            )}
        </div>
    );
};
