
export interface BasicStats {
  count: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  median: number;
  q3: number;
}

export interface CapabilityStats {
  cp?: number;
  cpk?: number;
  pp?: number;
  ppk?: number;
}

export interface HistogramData {
  bins: { x0: number; x1: number; y: number }[];
  normalCurve: { x: number; y: number }[];
}

export interface BoxPlotData {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

export interface ControlChartData {
  points: { subgroup: number; mean: number }[];
  cl: number;
  ucl: number;
  lcl: number;
}

export interface AnalysisResult {
  basicStats: BasicStats;
  capability: CapabilityStats;
  histogram: HistogramData;
  boxPlot: BoxPlotData;
  controlChart: ControlChartData | null;
}
