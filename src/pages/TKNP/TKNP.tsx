import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import CodeEditor from "../../components/CodeEditor"; // Fix import path
import "./TKNP.css"; // Import the new CSS file

interface Step {
  left: number;
  right: number;
  mid: number;
  value: number | null;
  isMatch: boolean;
  description: string;
  comparing?: boolean;
}

const TKNP: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 3, 4, 7, 8, 9, 10]);
  const [arrayInput, setArrayInput] = useState<string>("1,3,4,7,8,9,10");
  const [k, setK] = useState<number>(7);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [searchSteps, setSearchSteps] = useState<Step[]>([]);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number>(33);
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const binarySearch = useCallback((arr: number[], target: number): Step[] => {
    const steps: Step[] = [];
    let left = 0;
    let right = arr.length - 1;
    let stepCount = 1;

    steps.push({
      left: -1,
      right: -1,
      mid: -1,
      value: null,
      isMatch: false,
      comparing: false,
      description: "Bắt đầu thuật toán",
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        left,
        right,
        mid,
        value: arr[mid],
        isMatch: false,
        comparing: true,
        description: `Bước ${stepCount}:\nLấy (${left} + ${right})/2 = ${mid}; A[${mid}] = ${arr[mid]}`,
      });

      if (arr[mid] === target) {
        steps.push({
          left,
          right,
          mid,
          value: arr[mid],
          isMatch: true,
          comparing: false,
          description: `Tìm thấy K ở vị trí ${mid} trong mảng`,
        });
        return steps;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }

      stepCount++;
    }

    steps.push({
      left,
      right,
      mid: -1,
      value: null,
      isMatch: false,
      comparing: false,
      description: "Không tìm thấy K trong mảng",
    });
    return steps;
  }, []);

  useEffect(() => {
    const sortedArray = [...array].sort((a, b) => a - b);
    const steps = binarySearch(sortedArray, k);
    setSearchSteps(steps);
    setCurrentStep(0);
    setIsRunning(false);
  }, [array, k, binarySearch]);

  useEffect(() => {
    if (isRunning && currentStep < searchSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep >= searchSteps.length) {
      setIsRunning(false);
      setIsRunning(false);
    }
  }, [isRunning, currentStep, searchSteps]);

  const handleStart = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    if (currentStep < searchSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isSorted = (arr: number[]): boolean => {
    // Kiểm tra dãy số có được sắp xếp tăng dần
    const isAscending = arr.every(
      (val, i, arr) => i === 0 || val >= arr[i - 1]
    );
    // Kiểm tra dãy số có được sắp xếp giảm dần
    const isDescending = arr.every(
      (val, i, arr) => i === 0 || val <= arr[i - 1]
    );
    return isAscending || isDescending;
  };

  const handleArrayInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setArrayInput(inputValue);
  };

  const validateAndSetArray = () => {
    const newArray = arrayInput
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));

    if (isSorted(newArray)) {
      setArray([...newArray]); // Cập nhật dãy số nếu đã sắp xếp
    } else {
      alert("Dãy số chưa được sắp xếp"); // Hiển thị thông báo lỗi
      setArray([]); // Xóa dãy số nếu không hợp lệ
    }
  };

  const currentStepData = searchSteps[currentStep] || {
    left: 0,
    right: array.length - 1,
    mid: -1,
    value: null,
    isMatch: false,
    description: "",
  };

  const pythonCode = `
import json
def binary_search_with_steps(arr, target):
    steps = []
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        # Ghi lại bước tìm kiếm hiện tại
        steps.append({
            "left": left,
            "right": right,
            "mid": mid,
            "value": arr[mid],
            "isMatch": arr[mid] == target,
            "description": f"So sánh A[{mid}] = {arr[mid]} với {target}"
        })
        
        if arr[mid] == target:
            return steps
        elif arr[mid] < target:
            left = mid + 1
            steps.append({
                "left": left,
                "right": right,
                "mid": mid,
                "value": arr[mid],
                "isMatch": False,
                "description": f"A[{mid}] < {target}, tìm bên phải: left = {left}"
            })
        else:
            right = mid - 1
            steps.append({
                "left": left,
                "right": right,
                "mid": mid,
                "value": arr[mid],
                "isMatch": False,
                "description": f"A[{mid}] > {target}, tìm bên trái: right = {right}"
            })
    
    # Không tìm thấy
    steps.append({
        "left": left,
        "right": right,
        "mid": -1,
        "value": None,
        "isMatch": False,
        "description": "Không tìm thấy giá trị trong mảng"
    })
    return steps

# Test với mảng đã sắp xếp
arr = ${JSON.stringify(array)}
target = ${k}
steps = binary_search_with_steps(arr, target)
print(json.dumps(steps))
`;

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsRunning(false);
  };

  useEffect(() => {
    if (stepsContainerRef.current) {
      const container = stepsContainerRef.current;
      const steps = container.children;
      if (steps[currentStep]) {
        const stepElement = steps[currentStep] as HTMLElement;
        const containerHeight = container.offsetHeight;
        const stepTop = stepElement.offsetTop;
        const stepHeight = stepElement.offsetHeight;

        container.scrollTo({
          top: stepTop - containerHeight / 2 + stepHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentStep]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(Math.round(newLeftWidth * 2) / 2);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="bg-white p-4">
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        Bài học &gt; Thuật toán tìm kiếm &gt; thuật toán tìm kiếm nhị phân
      </div>

      {/* Main content với resizer */}
      <div className="flex space-x-4 relative" ref={containerRef}>
        {/* Steps section */}
        <div
          className="bg-gray-100 p-4 rounded h-500"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="text-2xl font-bold mb-4">Các bước thực hiện</h2>
          <div
            className="mt-4 h-[400px] overflow-y-auto scroll-smooth"
            ref={stepsContainerRef}
          >
            {searchSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`p-2 mb-2 transition-all duration-300 ${
                  index < currentStep
                    ? "bg-green-300 opacity-50"
                    : index === currentStep
                    ? "bg-yellow-200 border-2 border-blue-500 shadow-lg transform scale-105"
                    : "bg-purple-400 opacity-50"
                } rounded cursor-pointer hover:opacity-100 hover:shadow-md whitespace-pre-line`}
              >
                {step.description}
              </div>
            ))}
          </div>
        </div>

        {/* Thêm Resizer */}
        <div
          ref={resizerRef}
          className="resizer"
          style={{ left: `${leftWidth}%` }}
          onMouseDown={handleMouseDown}
        />

        {/* Visualization section */}
        <div className="bg-white" style={{ width: `${100 - leftWidth}%` }}>
          <div className="step-container overflow-hidden">
            {/* Input for array */}
            <div className="mt-4">
              <input
                type="text"
                value={arrayInput}
                onChange={handleArrayInputChange}
                placeholder="Nhập dãy số (cách nhau bởi dấu phẩy)"
                className="border rounded px-2 py-1 w-full mb-4"
              />
              <button
                onClick={validateAndSetArray}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Xác nhận dãy số
              </button>
            </div>

            <div className="flex mb-4 items-center">
              <p className="mr-4 text-lg font-bold flex-shrink-0">A=</p>
              <div className="flex flex-wrap">
                {array.map((num, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-2 text-lg font-semibold
                    ${
                      index === currentStepData.mid
                        ? "bg-yellow-300"
                        : index >= currentStepData.left &&
                          index <= currentStepData.right
                        ? "bg-purple-400"
                        : "bg-gray-300"
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <p className="mr-4 text-lg font-bold flex-shrink-0">i =</p>
              <div className="flex flex-wrap">
                {array.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-12 h-12 flex items-center justify-center mr-2 text-lg font-semibold
                    ${
                      index === currentStepData.mid
                        ? "bg-yellow-300"
                        : index >= currentStepData.left &&
                          index <= currentStepData.right
                        ? "bg-purple-400"
                        : "bg-gray-300"
                    }`}
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
            {currentStepData.comparing && (
              <div className="flex mb-4 items-center">
                <p className="mr-4 text-2xl font-bold flex-shrink-0">
                  So sánh:
                </p>
                <p className="mr-2">A[{currentStepData.mid}] = </p>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 bg-yellow-300`}
                >
                  {currentStepData.value}
                </div>
                <p className="mx-2 text-2xl">
                  {currentStepData.isMatch
                    ? "="
                    : currentStepData.value! < k
                    ? "<"
                    : ">"}
                </p>
                <p className="mr-2">K = </p>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 bg-blue-300`}
                >
                  {k}
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-300 p-4 rounded">
              <p className="font-bold mb-2">{currentStepData.description}</p>
              {currentStepData.comparing && (
                <div className="whitespace-pre-line">
                  {`So sánh A[${currentStepData.mid}] với K\n` +
                    (currentStepData.isMatch
                      ? `Vì A[${currentStepData.mid}] = K => Tìm thấy K tại vị trí ${currentStepData.mid}`
                      : currentStepData.value! < k
                      ? `Vì A[${currentStepData.mid}] < K => i + 1 = ${
                          currentStepData.mid + 1
                        }`
                      : `Vì A[${currentStepData.mid}] > K => i - 1 = ${
                          currentStepData.mid - 1
                        }`)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <input
              type="number"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value) || 0)}
              className="border rounded px-2 py-1 w-20"
            />
            <div className="space-x-2">
              <button
                onClick={handlePrev}
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                disabled={currentStep === 0}
              >
                Trước
              </button>
              {isRunning ? (
                <button
                  onClick={handleStop}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Dừng
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Bắt đầu
                </button>
              )}
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={currentStep === searchSteps.length - 1}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Thử nghiệm code</h2>
        <CodeEditor defaultCode={pythonCode} />
      </div>
    </div>
  );
};

export default TKNP;
