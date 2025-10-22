
import { AnalysisResult, BasicStats, BoxPlotData, CapabilityStats, ControlChartData, HistogramData } from '../types';

// Constants for X-bar chart (subgroup sizes 2-10)
const A2_FACTORS: { [key: number]: number } = {
    2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483,
    7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308,
};

const calculateMean = (data: number[]): number => {
    if (data.length === 0) return 0;
    return data.reduce((a, b) => a + b, 0) / data.length;
};

const calculateStdDev = (data: number[], mean?: number): number => {
    if (data.length < 2) return 0;
    const m = mean ?? calculateMean(data);
    const variance = data.reduce((sq, n) => sq + Math.pow(n - m, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
};

const calculateBasicStats = (data: number[]): BasicStats => {
    const sortedData = [...data].sort((a, b) => a - b);
    const count = data.length;
    const mean = calculateMean(data);
    const stdDev = calculateStdDev(data, mean);
    const min = sortedData[0];
    const max = sortedData[count - 1];

    const q1Index = Math.floor(count / 4);
    const medianIndex = Math.floor(count / 2);
    const q3Index = Math.floor(3 * count / 4);

    const q1 = sortedData[q1Index];
    const median = count % 2 === 0 ? (sortedData[medianIndex - 1] + sortedData[medianIndex]) / 2 : sortedData[medianIndex];
    const q3 = sortedData[q3Index];

    return { count, mean, stdDev, min, max, q1, median, q3 };
};

const calculateCapability = (stats: BasicStats, lsl: number | null, usl: number | null): CapabilityStats => {
    const { mean, stdDev } = stats;
    const result: CapabilityStats = {};

    if (lsl !== null && usl !== null && stdDev > 0) {
        const tolerance = usl - lsl;
        result.cp = tolerance / (6 * stdDev);
        result.pp = result.cp;

        const cpu = (usl - mean) / (3 * stdDev);
        const cpl = (mean - lsl) / (3 * stdDev);
        result.cpk = Math.min(cpu, cpl);
        result.ppk = result.cpk;
    }

    return result;
};

const calculateHistogram = (data: number[], stats: BasicStats): HistogramData => {
    const { count, min, max, mean, stdDev } = stats;
    const numBins = Math.ceil(1 + 3.322 * Math.log10(count));
    const binWidth = (max - min) / numBins;

    const bins = Array.from({ length: numBins }, (_, i) => ({
        x0: min + i * binWidth,
        x1: min + (i + 1) * binWidth,
        y: 0,
    }));
    
    data.forEach(d => {
        let binIndex = Math.floor((d - min) / binWidth);
        if(binIndex === numBins) binIndex--; // Include max value in last bin
        if(bins[binIndex]) {
            bins[binIndex].y++;
        }
    });

    const normalCurve = [];
    if (stdDev > 0) {
        for (let i = 0; i <= 100; i++) {
            const x = min + (i/100) * (max - min);
            const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
            const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
            normalCurve.push({x, y});
        }
    }
    const maxBinCount = Math.max(...bins.map(b => b.y));
    const maxNormalY = Math.max(...normalCurve.map(p => p.y));
    const scaledNormalCurve = normalCurve.map(p => ({...p, y: (p.y / maxNormalY) * maxBinCount }));


    return { bins, normalCurve: scaledNormalCurve };
};

const calculateBoxPlot = (stats: BasicStats): BoxPlotData => {
    const { min, max, q1, median, q3 } = stats;
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
    const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
    
    // Outliers would be calculated here, but for this visualization, we just use whiskers
    
    return { min: lowerWhisker, q1, median, q3, max: upperWhisker, outliers: [] };
};

const calculateControlChart = (data: number[], subgroupSize: number | null): ControlChartData | null => {
    if (!subgroupSize || subgroupSize < 2 || !A2_FACTORS[subgroupSize]) {
        return null;
    }
    
    const subgroups: number[][] = [];
    for (let i = 0; i < data.length; i += subgroupSize) {
        const subgroup = data.slice(i, i + subgroupSize);
        if (subgroup.length === subgroupSize) {
            subgroups.push(subgroup);
        }
    }

    if (subgroups.length < 2) return null;

    const subgroupMeans = subgroups.map(sg => calculateMean(sg));
    const subgroupRanges = subgroups.map(sg => Math.max(...sg) - Math.min(...sg));

    const cl = calculateMean(subgroupMeans); // X-double-bar
    const rBar = calculateMean(subgroupRanges);
    const a2 = A2_FACTORS[subgroupSize];
    const ucl = cl + a2 * rBar;
    const lcl = cl - a2 * rBar;

    const points = subgroupMeans.map((mean, i) => ({ subgroup: i + 1, mean }));

    return { points, cl, ucl, lcl };
};


export const performStatisticalAnalysis = (data: number[], lsl: number | null, usl: number | null, subgroupSize: number | null): AnalysisResult => {
    const basicStats = calculateBasicStats(data);
    const capability = calculateCapability(basicStats, lsl, usl);
    const histogram = calculateHistogram(data, basicStats);
    const boxPlot = calculateBoxPlot(basicStats);
    const controlChart = calculateControlChart(data, subgroupSize);

    return {
        basicStats,
        capability,
        histogram,
        boxPlot,
        controlChart
    };
};
