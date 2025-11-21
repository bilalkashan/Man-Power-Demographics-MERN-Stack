// src/components/ChartModal.jsx (Create this new file)
import React from "react";
import { FaTimes } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import ChartFilter from "./ChartFilter"; // You'll need to create a simple Filter component
// Import all necessary chart components (BarChart, LineChart, PieChart, etc.)

const ChartModal = ({ isOpen, onClose, title, data, chartType, filters, onFilterChange, filterOptions, darkMode }) => {
    if (!isOpen) return null;

    // Determine the color scheme for the modal's chart based on darkMode
    const tickColor = darkMode ? "#E5E7EB" : "#4B5563";
    const tooltipStyle = {
        backgroundColor: darkMode ? "#374151" : "#FFFFFF",
        borderRadius: "8px",
        border: "1px solid #eee",
        padding: "8px",
        fontSize: "14px",
    };
    
    // Helper function to render the appropriate Recharts component
    const renderChart = () => {
        // ... (Re-implement your specific chart logic here, referencing the large data set)
        
        if (chartType === "GenderRatio") {
            // Re-use the GenderRatio PieChart logic here with full size and all data
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        {/* ... Recharts components using 'data' prop ... */}
                    </PieChart>
                </ResponsiveContainer>
            );
        } else if (chartType === "HiringTrend") {
            // Re-use the Hiring Trend LineChart logic here
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fill: tickColor }} />
                        <YAxis tick={{ fill: tickColor }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ color: tickColor }}/>
                        <Line type="monotone" dataKey="hires" stroke="#059669" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            );
        }
        // ... add cases for other chart types (Age, Education, etc.)
        
        return <div className="text-center py-20 text-gray-400">Chart not implemented for modal yet.</div>;
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm`}>
            <div className={`w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
                <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title} - Detailed View</h2>
                    <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-auto p-4 flex">
                    {/* Filter Section */}
                    <div className="w-1/4 pr-4 border-r border-gray-200 dark:border-gray-700 space-y-4">
                        <h3 className="text-lg font-semibold mb-3">Filter Data</h3>
                        {/* Re-use the logic for rendering the global filter dropdowns */}
                        <ChartFilter 
                            globalFilters={filters} 
                            handleFilterChange={onFilterChange} 
                            filterOptions={filterOptions} 
                        />
                    </div>
                    
                    {/* Chart Display Section */}
                    <div className="w-3/4 pl-4">
                        <div className="h-full flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">Chart Visualization</h3>
                            <div className="flex-1 min-h-0">
                                {/* The rendering is delegated here */}
                                {renderChart()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartModal;