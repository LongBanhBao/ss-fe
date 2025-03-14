import React from 'react';

interface ArrayVisualizationProps {
  array: number[];
  highlightIndices?: number[];
  comparingIndices?: number[];
  swappingIndices?: number[];
}

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  array,
  highlightIndices = [],
  comparingIndices = [],
  swappingIndices = []
}) => {
  return (
    <div className="flex items-end justify-center space-x-1 h-64">
      {array.map((value, index) => (
        <div
          key={index}
          className={`w-10 flex flex-col items-center ${
            highlightIndices.includes(index)
              ? 'bg-yellow-400'
              : comparingIndices.includes(index)
              ? 'bg-blue-400'
              : swappingIndices.includes(index)
              ? 'bg-green-400'
              : 'bg-gray-300'
          }`}
          style={{ height: `${(value / Math.max(...array)) * 100}%` }}
        >
          <span className="text-sm">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default ArrayVisualization;
