
import React, { useState, useCallback, useMemo } from 'react';
import { DataInput } from './components/DataInput';
import { Dashboard } from './components/Dashboard';
import { AnalysisResult } from './types';
import { performStatisticalAnalysis } from './services/statisticalAnalysis';
import { ChartIcon, GithubIcon } from './components/icons';
import { HeaderInfo } from './components/HeaderInfo';

interface AnalysisData {
  result: AnalysisResult;
  lsl: number | null;
  usl: number | null;
}

const App: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback((data: number[], lsl: number | null, usl: number | null, subgroupSize: number | null) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);

    // Simulate async operation for better UX
    setTimeout(() => {
      try {
        if (data.length < 2) {
          throw new Error("Please provide at least two data points for analysis.");
        }
        const results = performStatisticalAnalysis(data, lsl, usl, subgroupSize);
        setAnalysisData({ result: results, lsl, usl });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred during analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);
  
  const memoizedDashboard = useMemo(() => {
    return analysisData ? <Dashboard result={analysisData.result} lsl={analysisData.lsl} usl={analysisData.usl} /> : null;
  }, [analysisData]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ChartIcon className="h-8 w-8 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">
                Statistical Process Control Analyzer
              </h1>
            </div>
            <a href="https://github.com/google/aistudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <GithubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <HeaderInfo />
        <DataInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex justify-center items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-lg">Analyzing data...</p>
          </div>
        )}
        
        {memoizedDashboard}
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Built for advanced statistical analysis. &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
