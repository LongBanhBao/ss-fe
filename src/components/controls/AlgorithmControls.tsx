import React from 'react';

interface AlgorithmControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextStep: () => void;
  isPlaying: boolean;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  onStart,
  onPause,
  onReset,
  onNextStep,
  isPlaying
}) => {
  return (
    <div className="flex justify-center space-x-4 my-4">
      <button
        onClick={isPlaying ? onPause : onStart}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPlaying ? 'Tạm dừng' : 'Bắt đầu'}
      </button>
      <button
        onClick={onNextStep}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Bước tiếp
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Đặt lại
      </button>
    </div>
  );
};

export default AlgorithmControls;
