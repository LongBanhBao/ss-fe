import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
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
  def bubble_sort_with_steps(arr):
      steps = []
      n = len(arr)
      array_copy = arr.copy()  # Tạo bản sao để không thay đổi mảng gốc
      
      for i in range(n):
          for j in range(0, n-i-1):
              # Ghi lại bước so sánh
              steps.append({
                  "array": array_copy.copy(),
                  "i": i,
                  "j": j,
                  "comparing": True,
                  "description": f"So sánh A[{j}] = {array_copy[j]} với A[{j+1}] = {array_copy[j+1]}"
              })
              
              if array_copy[j] > array_copy[j+1]:
                  # Thực hiện hoán đổi
                  array_copy[j], array_copy[j+1] = array_copy[j+1], array_copy[j]
                  
                  # Ghi lại bước hoán đổi
                  steps.append({
                      "array": array_copy.copy(),
                      "i": i,
                      "j": j,
                      "comparing": False,
                      "description": f"Hoán đổi A[{j}] = {array_copy[j]} với A[{j+1}] = {array_copy[j+1]}"
                  })
      
      # Ghi lại bước cuối cùng
      steps.append({
          "array": array_copy.copy(),
          "i": -1,
          "j": -1,
          "comparing": False,
          "description": "Sắp xếp hoàn tất"
      })
      
      return steps

  # Test với mảng
  arr = ${JSON.stringify(array)}
  steps = bubble_sort_with_steps(arr)
  print(json.dumps(steps))
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
    <div className="bg-white p-4">
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        Bài học &gt; Thuật toán sắp xếp &gt; thuật toán sắp xếp nổi bọt
      </div>

      {/* Main content */}
      <div className="flex space-x-4 relative" ref={containerRef}>
        {/* Steps section */}
        <div
          className="bg-gray-100 p-4 rounded h-500px"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="text-xl font-bold mb-4">Các bước thực hiện</h2>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <div className="mt-2 flex space-x-4">
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
                    className="w-12 h-12 flex items-center justify-center mr-2 mb-2 bg-purple-400"
                  >
                    {index}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {currentStepData.comparing && (
            <div className="flex mb-4 items-center">
              <p className="mr-4 text-2xl font-bold flex-shrink-0">So sánh:</p>
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
          <div className="bg-white border border-gray-300 p-4 rounded">
            <p className="font-bold mb-2">{currentStepData.description}</p>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="space-x-2">
              <button
                onClick={handlePrev}
                className="bg-gray-200 px-4 py-2 rounded"
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
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
          <h2 className="text-2xl font-bold mb-4">Thử nghiệm code</h2>
          <CodeEditor defaultCode={pythonCode} />
        </div>
      </div>
    </div>
  );
};

export default BubbleSort;
