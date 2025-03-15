import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CodeEditor from "../../components/CodeEditor";
import "./SXNoiBot.css"; // Import the new CSS file

interface Step {
  array: number[];
  i: number;
  j: number;
  comparing: boolean;
  description: string;
  animatingIndices?: { from: number; to: number };
}

const BubbleSort: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 8, 7, 8, 3, 9, 10]);
  const [arrayInput, setArrayInput] = useState<string>("1,8,7,8,3,9,10");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sortSteps, setSortSteps] = useState<Step[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number>(40);
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bubbleSort = useCallback(
    (arr: number[]): Step[] => {
      const steps: Step[] = [];
      const sortedArr = [...arr];
      steps.push({
        array: [...sortedArr],
        i: -1,
        j: -1,
        comparing: false,
        description: `Bắt đầu thuật toán sắp xếp nổi bọt ${
          isAscending ? "tăng dần" : "giảm dần"
        }`,
      });

      for (let i = 0; i < sortedArr.length - 1; i++) {
        for (let j = 0; j < sortedArr.length - i - 1; j++) {
          steps.push({
            array: [...sortedArr],
            i,
            j,
            comparing: true,
            description: `So sánh A[${j}] = ${sortedArr[j]} với A[${j + 1}] = ${
              sortedArr[j + 1]
            }`,
          });

          if (
            isAscending
              ? sortedArr[j] > sortedArr[j + 1]
              : sortedArr[j] < sortedArr[j + 1]
          ) {
            [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
            steps.push({
              array: [...sortedArr],
              i,
              j,
              comparing: false,
              description: `Hoán đổi A[${j}] và A[${j + 1}]`,
              animatingIndices: { from: j, to: j + 1 },
            });
          }
        }
      }

      steps.push({
        array: [...sortedArr],
        i: -1,
        j: -1,
        comparing: false,
        description: `Thuật toán sắp xếp nổi bọt ${
          isAscending ? "tăng dần" : "giảm dần"
        } hoàn tất`,
      });

      return steps;
    },
    [isAscending]
  );

  useEffect(() => {
    const steps = bubbleSort(array);
    setSortSteps(steps);
    setCurrentStep(0);
  }, [array, bubbleSort]);

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
    comparing: false,
    description: "",
  };

  const pythonCode = `
def bubble_sort(arr):
    n = len(arr)

    for i in range(n - 1):
        swapped = False

        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:  # Nếu phần tử trước lớn hơn phần tử sau, hoán đổi
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # Nếu không có hoán đổi nào, danh sách đã được sắp xếp
        if not swapped:
            break

    return arr

# 📝 Kiểm tra thuật toán
arr = list(map(int, input().split(" ")))

for i in bubble_sort(arr):
    print(i, end=" ")
`;

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
        Bài học &gt; Thuật toán sắp xếp &gt; thuật toán sắp xếp nổi bọt
      </div>

      {/* Main content */}
      <div className="relative flex space-x-4" ref={containerRef}>
        {/* Steps section */}
        <div
          className="p-4 bg-gray-100 rounded h-500px"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="mb-4 text-xl font-bold">Các bước thực hiện</h2>
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

        {/* Resizer */}
        <div
          ref={resizerRef}
          className="resizer"
          style={{ left: `${leftWidth}%` }}
          onMouseDown={handleMouseDown}
        />

        {/* Visualization section */}
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
          <div className="flex flex-col gap-4">
            {/* Array A display */}
            <div className="flex items-center">
              <p className="w-16 text-2xl font-bold">A=</p>
              <div className="flex flex-wrap">
                {currentStepData.array.map((num, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 mb-2 transition-all duration-500
                      ${
                        index === currentStepData.j
                          ? "bg-green-300"
                          : index === currentStepData.j + 1
                          ? "bg-red-300"
                          : index >=
                            currentStepData.array.length - currentStepData.i
                          ? "bg-gray-300"
                          : "bg-purple-400"
                      }
                      ${
                        currentStepData.comparing &&
                        (index === currentStepData.j ||
                          index === currentStepData.j + 1)
                          ? "border-4 border-blue-500"
                          : ""
                      }`}
                    style={{
                      transform:
                        currentStepData.animatingIndices &&
                        currentStepData.description.includes("Hoán đổi") &&
                        (index === currentStepData.animatingIndices.from ||
                          index === currentStepData.animatingIndices.to)
                          ? `translateX(${
                              index === currentStepData.animatingIndices.from
                                ? "3rem"
                                : "-3rem"
                            })`
                          : "none",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Index i display */}
            <div className="flex items-center">
              <p className="w-16 text-2xl font-bold">i=</p>
              <div className="flex flex-wrap">
                {currentStepData.array.map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center w-12 h-12 mb-2 mr-2 bg-purple-400"
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {currentStepData.comparing && (
            <div className="flex items-center mb-4">
              <p className="flex-shrink-0 mr-4 text-2xl font-bold">So sánh:</p>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 bg-green-300`}
              >
                {currentStepData.array[currentStepData.j]}
              </div>
              <p className="mx-2 text-2xl">
                {currentStepData.array[currentStepData.j] <=
                currentStepData.array[currentStepData.j + 1]
                  ? "≤"
                  : ">"}
              </p>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 bg-red-300`}
              >
                {currentStepData.array[currentStepData.j + 1]}
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
          <CodeEditor defaultCode={pythonCode} defaultInput="10 2 3 4 5 64 1" />
        </div>
      </div>
    </div>
  );
};

export default BubbleSort;
