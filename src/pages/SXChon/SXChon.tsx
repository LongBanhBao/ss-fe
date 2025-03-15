import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CodeEditor from "../../components/CodeEditor";
import "./SXChon.css"; // Import file CSS

interface Step {
  array: number[];
  i: number;
  j: number;
  minIndex: number;
  comparing: boolean;
  description: string;
  animatingIndices?: { from: number; to: number };
}

const SelectionSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 8, 7, 8, 3, 9, 10]);
  const [arrayInput, setArrayInput] = useState<string>("1,8,7,8,3,9,10");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sortSteps, setSortSteps] = useState<Step[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number>(33);
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectionSort = useCallback(
    (arr: number[]): Step[] => {
      const steps: Step[] = [];
      const sortedArr = [...arr];
      steps.push({
        array: [...sortedArr],
        i: -1,
        j: -1,
        minIndex: -1,
        comparing: false,
        description: `Bắt đầu thuật toán sắp xếp ${
          isAscending ? "tăng dần" : "giảm dần"
        }`,
      });

      for (let i = 0; i < sortedArr.length - 1; i++) {
        let minIndex = i;
        steps.push({
          array: [...sortedArr],
          i,
          j: -1,
          minIndex,
          comparing: false,
          description: `Bước ${i + 1}: Chọn A[${i}] = ${
            sortedArr[i]
          } làm phần tử ${isAscending ? "nhỏ" : "lớn"} nhất ban đầu`,
        });

        for (let j = i + 1; j < sortedArr.length; j++) {
          steps.push({
            array: [...sortedArr],
            i,
            j,
            minIndex,
            comparing: true,
            description: `So sánh A[${j}] = ${sortedArr[j]} với A[${minIndex}] = ${sortedArr[minIndex]}`,
          });

          if (
            isAscending
              ? sortedArr[j] < sortedArr[minIndex]
              : sortedArr[j] > sortedArr[minIndex]
          ) {
            minIndex = j;
            steps.push({
              array: [...sortedArr],
              i,
              j,
              minIndex,
              comparing: false,
              description: `Cập nhật phần tử ${
                isAscending ? "nhỏ" : "lớn"
              } nhất mới: A[${minIndex}] = ${sortedArr[minIndex]}`,
            });
          }
        }

        if (minIndex !== i) {
          [sortedArr[i], sortedArr[minIndex]] = [
            sortedArr[minIndex],
            sortedArr[i],
          ];
          steps.push({
            array: [...sortedArr],
            i,
            j: -1,
            minIndex: -1,
            comparing: false,
            description: `Hoán đổi A[${i}] = ${sortedArr[i]} và A[${minIndex}] = ${sortedArr[minIndex]}`,
            animatingIndices: { from: i, to: minIndex },
          });
        } else {
          steps.push({
            array: [...sortedArr],
            i,
            j: -1,
            minIndex: -1,
            comparing: false,
            description: `A[${i}] đã ở đúng vị trí, không cần hoán đổi`,
          });
        }
      }

      steps.push({
        array: [...sortedArr],
        i: -1,
        j: -1,
        minIndex: -1,
        comparing: false,
        description: `Thuật toán sắp xếp ${
          isAscending ? "tăng dần" : "giảm dần"
        } hoàn tất`,
      });

      return steps;
    },
    [isAscending]
  );

  useEffect(() => {
    const steps = selectionSort(array);
    setSortSteps(steps);
    setCurrentStep(0);
  }, [array, selectionSort]);

  useEffect(() => {
    if (isRunning && currentStep < sortSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep >= sortSteps.length - 1) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep, sortSteps]);

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

  const handleStart = () => {
    setIsRunning(true);
    setCurrentStep(0);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleNext = () => {
    if (currentStep < sortSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleArrayInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArrayInput(e.target.value);
    const newArray = e.target.value
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    setArray(newArray);
  };

  const handleSortTypeChange = (ascending: boolean) => {
    setIsAscending(ascending);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsRunning(false);
  };

  const currentStepData = sortSteps[currentStep] || {
    array: array,
    i: -1,
    j: -1,
    minIndex: -1,
    comparing: false,
    description: "",
  };

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
      <div className="breadcrumb">
        Bài học &gt; Thuật toán sắp xếp &gt; thuật toán sắp xếp chọn
      </div>

      {/* Main content */}
      <div className="relative flex space-x-4" ref={containerRef}>
        <div
          className="p-4 bg-gray-100 rounded h-500px"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="mb-4 font-bold">Các bước thực hiện</h2>
          <div
            className="mt-4 h-[400px] overflow-y-auto scroll-smooth"
            ref={stepsContainerRef}
          >
            {sortSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => handleStepClick(index)}
                className={`p-2 mb-2 transition-all duration-300 ${
                  index < currentStep
                    ? "bg-green-300 opacity-50"
                    : index === currentStep
                    ? "bg-yellow-200 border-2 border-blue-500 shadow-lg transform scale-105"
                    : "bg-purple-400 opacity-50"
                } rounded cursor-pointer hover:opacity-100 hover:shadow-md`}
              >
                {step.description}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={resizerRef}
          className="resizer"
          style={{ left: `${leftWidth}%` }}
          onMouseDown={handleMouseDown}
        />

        <div className="bg-white" style={{ width: `${100 - leftWidth}%` }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nhập dãy số A (cách nhau bởi dấu phẩy):
            </label>
            <input
              type="text"
              value={arrayInput}
              onChange={handleArrayInputChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <div className="flex mt-2 space-x-4">
              <button
                onClick={() => handleSortTypeChange(true)}
                className={`px-4 py-2 rounded ${
                  isAscending
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Sắp xếp tăng dần
              </button>
              <button
                onClick={() => handleSortTypeChange(false)}
                className={`px-4 py-2 rounded ${
                  !isAscending
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Sắp xếp giảm dần
              </button>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex items-center" style={{ height: "48px" }}>
              <span className="mr-4 text-2xl font-bold">A=</span>
              <div className="flex">
                {currentStepData.array.map((num, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 transition-all duration-500
                      ${
                        index === currentStepData.i
                          ? "bg-yellow-300"
                          : index === currentStepData.j
                          ? "bg-green-300"
                          : index === currentStepData.minIndex
                          ? "bg-red-300"
                          : index < currentStepData.i
                          ? "bg-gray-300"
                          : "bg-purple-400"
                      }
                      ${
                        currentStepData.comparing &&
                        (index === currentStepData.j ||
                          index === currentStepData.minIndex)
                          ? "border-4 border-blue-500"
                          : ""
                      }`}
                    style={{
                      transform:
                        currentStepData.animatingIndices &&
                        currentStepData.description.includes("Hoán đổi")
                          ? index === currentStepData.animatingIndices.from
                            ? `translateX(${
                                (currentStepData.animatingIndices.to -
                                  currentStepData.animatingIndices.from) *
                                3.5
                              }rem)`
                            : index === currentStepData.animatingIndices.to
                            ? `translateX(${
                                (currentStepData.animatingIndices.from -
                                  currentStepData.animatingIndices.to) *
                                3.5
                              }rem)`
                            : "none"
                          : "none",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <p className="flex flex-shrink-0 mr-4 text-2xl font-bold">i =</p>
            {currentStepData.array.map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center mr-2
                ${
                  index === currentStepData.i
                    ? "bg-yellow-300"
                    : "bg-purple-400"
                }`}
              >
                {index}
              </div>
            ))}
          </div>
          {currentStepData.comparing && (
            <div className="flex items-center mb-4">
              <p className="flex-shrink-0 mr-4 text-2xl font-bold">So sánh:</p>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 bg-red-300`}
              >
                {currentStepData.array[currentStepData.minIndex]}
              </div>
              <p className="mx-2 text-2xl">
                {currentStepData.array[currentStepData.minIndex] <=
                currentStepData.array[currentStepData.j]
                  ? "≤"
                  : ">"}
              </p>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 bg-green-300`}
              >
                {currentStepData.array[currentStepData.j]}
              </div>
            </div>
          )}
          <div className="p-4 bg-white border border-gray-300 rounded">
            <p className="mb-2 font-bold">{currentStepData.description}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="space-x-2">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-200 rounded"
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
                className="px-4 py-2 text-white bg-blue-500 rounded"
                disabled={currentStep === sortSteps.length - 1}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Thử nghiệm code</h2>
          <CodeEditor
            defaultCode={`
def selection_sort(arr):
    n = len(arr)
    for i in range(n-1):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

arr = list(map(int, input().split(" ")))

for i in selection_sort(arr):
        print(i, end=" ")`}
            defaultInput="1 8 7 8 3 9 10"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionSort;
