
import React from 'react';
import { Card } from './Card';

const LogoPlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M20,80 L20,20 L80,20 L80,80 Z" stroke="currentColor" strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="20" fill="currentColor" />
    </svg>
);


export const HeaderInfo: React.FC = () => {
    return (
        <Card title="Study Information" className="mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0 flex flex-col items-center">
                   <LogoPlaceholder className="h-20 w-20 text-cyan-400" />
                   <p className="mt-2 text-sm text-gray-400 font-semibold">Your Company</p>
                </div>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div>
                        <label htmlFor="product" className="block text-sm font-medium text-gray-300">Product</label>
                        <input type="text" id="product" className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" placeholder="e.g., Piston Ring" />
                    </div>
                    <div>
                        <label htmlFor="feature" className="block text-sm font-medium text-gray-300">Characteristic</label>
                        <input type="text" id="feature" className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" placeholder="e.g., Diameter (mm)" />
                    </div>
                    <div>
                        <label htmlFor="instrument" className="block text-sm font-medium text-gray-300">Measuring Instrument</label>
                        <input type="text" id="instrument" className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" placeholder="e.g., Digital Caliper" />
                    </div>
                    <div>
                        <label htmlFor="study-date" className="block text-sm font-medium text-gray-300">Date of Study</label>
                        <input type="date" id="study-date" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 p-2" />
                    </div>
                </div>
            </div>
        </Card>
    );
};
