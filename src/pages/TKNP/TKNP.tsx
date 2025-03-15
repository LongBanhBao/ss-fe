import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
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
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Nhập mảng từ bàn phím
arr = list(map(int, input("Nhập các phần tử của mảng, cách nhau bởi dấu cách: ").split(" ")))
arr.sort()  # Tìm kiếm nhị phân yêu cầu mảng phải được sắp xếp

# Xuất mảng đã sắp xếp
print("Mảng sau khi sắp xếp:", arr)

# Nhập giá trị cần tìm
target = int(input("Nhập số cần tìm: "))

# Gọi hàm tìm kiếm nhị phân
result = binary_search(arr, target)

# Hiển thị kết quả
if result != -1:
    print(f"Phần tử {target} được tìm thấy tại vị trí {result} (chỉ mục bắt đầu từ 0)")
else:
    print("Phần tử không có trong mảng.")`.trim();

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
    <div className="p-4 bg-white">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm">
        Bài học &gt; Thuật toán tìm kiếm &gt; thuật toán tìm kiếm nhị phân
      </div>

      {/* Main content với resizer */}
      <div className="relative flex space-x-4" ref={containerRef}>
        {/* Steps section */}
        <div
          className="p-4 bg-gray-100 rounded h-500"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="mb-4 text-2xl font-bold">Các bước thực hiện</h2>
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
          <div className="overflow-hidden step-container">
            {/* Input for array */}
            <div className="mt-4">
              <input
                type="text"
                value={arrayInput}
                onChange={handleArrayInputChange}
                placeholder="Nhập dãy số (cách nhau bởi dấu phẩy)"
                className="w-full px-2 py-1 mb-4 border rounded"
              />
              <button
                onClick={validateAndSetArray}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Xác nhận dãy số
              </button>
            </div>

            <div className="flex items-center mb-4">
              <p className="flex-shrink-0 mr-4 text-lg font-bold">A=</p>
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
            <div className="flex items-center mb-4">
              <p className="flex-shrink-0 mr-4 text-lg font-bold">i =</p>
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
              <div className="flex items-center mb-4">
                <p className="flex-shrink-0 mr-4 text-2xl font-bold">
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

            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="mb-2 font-bold">{currentStepData.description}</p>
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

          <div className="flex items-center justify-between mt-4">
            <input
              type="number"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 border rounded"
            />
            <div className="space-x-2">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                disabled={currentStep === 0}
              >
                Trước
              </button>
              {isRunning ? (
                <button
                  onClick={handleStop}
                  className="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Dừng
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-4 py-2 text-white bg-green-500 rounded"
                >
                  Bắt đầu
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
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
        <h2 className="mb-4 text-2xl font-bold">Thử nghiệm code</h2>
        <CodeEditor
          defaultCode={pythonCode}
          defaultInput={`
5 4 7 8 9 0 1 2 3 6
8`}
        />
      </div>
    </div>
  );
};

export default TKNP;
