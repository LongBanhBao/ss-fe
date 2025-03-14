import React from 'react';
import { algorithmExplanations } from '../../data/algorithmExplanations';

interface AlgorithmExplanationProps {
  algorithmId: keyof typeof algorithmExplanations;
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ algorithmId }) => {
  const explanation = algorithmExplanations[algorithmId];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">{explanation.title}</h2>
      <p className="text-gray-700 mb-4">{explanation.description}</p>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Độ phức tạp</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Thời gian:</p>
            <p className="text-blue-600">{explanation.complexity.time}</p>
          </div>
          <div>
            <p className="font-medium">Không gian:</p>
            <p className="text-blue-600">{explanation.complexity.space}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Các bước thực hiện</h3>
        <div className="space-y-4">
          {explanation.steps.map((step, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">{step.title}</h4>
              <p className="text-gray-600">{step.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Ví dụ minh họa</h3>
        {explanation.examples.map((example, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">Input: {example.input}</p>
            <p className="font-medium">Target: {example.target}</p>
            <div className="mt-2">
              {example.steps.map((step, stepIndex) => (
                <p key={stepIndex} className="text-gray-600">• {step}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmExplanation;
