import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import CodeEditor from "../../components/CodeEditor";
import "./SXChenK.css"; // Import the new CSS file

interface Step {
  array: (number | null)[];
  i: number;
  j: number;
  value: number | null;
  description: string;
  animatingIndices?: { from: number; to: number | null };
}

const InsertionSort: React.FC = () => {
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

  const currentStepData = sortSteps[currentStep] || {
    array: array,
    i: 0,
    j: -1,
    value: null,
    description: "",
  };

  const insertionSort = useCallback(
    (arr: number[]): Step[] => {
      const steps: Step[] = [];
      const sortedArr = [...arr];

      steps.push({
        array: [...sortedArr],
        i: 0,
        j: -1,
        value: null,
        description: `Bắt đầu thuật toán sắp xếp ${
          isAscending ? "tăng dần" : "giảm dần"
        }`,
      });

      for (let i = 1; i < sortedArr.length; i++) {
        const value = sortedArr[i];
        let j = i - 1;

        // Bước 1: Chọn phần tử A[i] - chỉ đổi màu
        steps.push({
          array: [...sortedArr],
          i,
          j: -1,
          value: null,
          description: `Bước ${i}: Chọn A[${i}] = ${value}`,
        });

        // Bước 2: Đưa A[i] lên hàng chờ D - thêm animation di chuyển
        let tempArr: (number | null)[] = [...sortedArr];
        tempArr[i] = null; // Tạo chỗ trống ở vị trí cũ
        steps.push({
          array: [...tempArr],
          i,
          j: -1,
          value,
          description: `Đưa A[${i}] = ${value} lên hàng chờ D`,
          animatingIndices: { from: i, to: null },
        });

        while (
          j >= 0 &&
          (isAscending ? sortedArr[j] > value : sortedArr[j] < value)
        ) {
          // Bước 3: So sánh với phần tử bên trái
          steps.push({
            array: [...tempArr],
            i,
            j,
            value,
            description: `So sánh D = ${value} với A[${j}] = ${sortedArr[j]}`,
          });

          // Bước 4: Di chuyển phần tử sang phải nếu lớn hơn
          const moveArr = [...tempArr];
          moveArr[j + 1] = sortedArr[j];
          moveArr[j] = null; // Tạo chỗ trống ở vị trí cũ
          steps.push({
            array: [...moveArr],
            i,
            j,
            value,
            description: `Di chuyển A[${j}] = ${sortedArr[j]} sang phải`,
            animatingIndices: { from: j, to: j + 1 },
          });

          sortedArr[j + 1] = sortedArr[j];
          tempArr = [...moveArr];
          j--;
        }

        // Bước 5: Chèn giá trị từ hàng chờ vào vị trí thích hợp
        steps.push({
          array: [...tempArr],
          i: -1,
          j: j + 1,
          value,
          description: `Chèn ${value} từ hàng chờ D vào vị trí ${j + 1}`,
          animatingIndices: { from: -1, to: j + 1 },
        });

        // Sau khi animation hoàn tất
        sortedArr[j + 1] = value;
        tempArr[j + 1] = value;
        steps.push({
          array: [...sortedArr],
          i: -1,
          j: j + 1,
          value: null,
          description: `Đã chèn ${value} vào vị trí ${j + 1}`,
        });
      }

      // Thêm bước kết thúc
      steps.push({
        array: [...sortedArr],
        i: -1,
        j: -1,
        value: null,
        description: `Thuật toán sắp xếp ${
          isAscending ? "tăng dần" : "giảm dần"
        } hoàn tất`,
      });

      return steps;
    },
    [isAscending]
  );

  useEffect(() => {
    const steps = insertionSort(array);
    setSortSteps(steps);
    setCurrentStep(0);
  }, [array, insertionSort]);

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

        // Scroll đến vị trí giữa container với animation mượt
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
    // Reset về trạng thái ban đầu khi đổi kiểu sắp xếp
    setCurrentStep(0);
    setIsRunning(false);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsRunning(false); // Dừng animation nếu đang chạy
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
    <div className="bg-white p-4">
      {/* Breadcrumb - Cp nhật class */}
      <div className="breadcrumb">
        Bài học &gt; Thuật toán sắp xếp &gt; thuật toán sắp xếp chèn
      </div>

      {/* Main content - Điều chỉnh tỷ lệ */}
      <div className="flex space-x-4 relative" ref={containerRef}>
        {/* Steps section */}
        <div
          className="bg-gray-100 p-4 rounded h-500px"
          style={{ width: `${leftWidth}%` }}
        >
          <h2 className="font-bold mb-4">Các bước thực hiện</h2>
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
          {/* Input and array display */}
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

            {/* Thêm các nút chọn kiểu sắp xếp */}
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

          {/* Display D */}
          <div className="flex mb-4 items-center relative h-20">
            <p className="mr-4 text-2xl font-bold flex-shrink-0">D=</p>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 absolute transition-all duration-500
              ${
                currentStepData.value !== null
                  ? "bg-yellow-300"
                  : "bg-white border-2 border-dashed border-gray-300"
              }
              `}
              style={{
                left: `3rem`,
                top: "0",
                transform: "translateY(0)",
              }}
            >
              {currentStepData.value !== null ? currentStepData.value : ""}
            </div>
          </div>

          {/* Display A */}
          <div className="flex mb-4 items-center relative h-20">
            <p className="mr-4 text-2xl font-bold flex-shrink-0">A=</p>
            {currentStepData.array.map((num, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 absolute transition-all duration-500
                ${
                  index === currentStepData.i && !currentStepData.value
                    ? "bg-yellow-300" // Chỉ đổi màu khi chọn
                    : index === currentStepData.j
                    ? "bg-green-300"
                    : num === null
                    ? "bg-white border-2 border-dashed border-gray-300" // Chỗ trống
                    : "bg-purple-400"
                }
                ${
                  currentStepData.animatingIndices?.from === index
                    ? currentStepData.animatingIndices.to === null
                      ? "-translate-y-20 opacity-0" // Animation di chuyển lên D
                      : `translate-x-[${
                          (currentStepData.animatingIndices.to - index) * 3.5
                        }rem] opacity-0` // Animation di chuyển ngang
                    : currentStepData.animatingIndices?.from === -1 &&
                      currentStepData.animatingIndices?.to === index
                    ? "translate-y-20 opacity-0" // Animation di chuyển từ D xuống A
                    : ""
                }
                `}
                style={{
                  left: `${index * 3.5 + 3}rem`,
                }}
              >
                {num !== null ? num : ""}
              </div>
            ))}
          </div>

          <div className="flex mb-4 items-center">
            <p className="mr-4 text-2xl font-bold flex flex-shrink-0">i =</p>
            {currentStepData.array.map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center mr-2 
                ${
                  index === currentStepData.i
                    ? "bg-yellow-300"
                    : index === currentStepData.j
                    ? "bg-green-300"
                    : "bg-purple-400"
                }`}
              >
                {index}
              </div>
            ))}
          </div>

          {/* Comparison display - Only show when not animating */}
          {currentStepData.j >= 0 &&
            currentStepData.value !== null &&
            !currentStepData.animatingIndices && (
              <div className="flex items-center my-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-xl font-bold mr-6">So sánh:</p>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-red-300 shadow-md`}
                  >
                    {currentStepData.array[currentStepData.j]}
                  </div>
                  <div className="mx-4 text-2xl font-bold text-gray-600">
                    {(currentStepData.array[currentStepData.j] ?? 0) >
                    (currentStepData.value ?? 0)
                      ? ">"
                      : "≤"}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-green-300 shadow-md`}
                  >
                    {currentStepData.value}
                  </div>
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

      {/* Code Editor Section - Cập nhật theo style mới */}
      <div className="flex flex-col">
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Thử nghiệm code</h2>
          <CodeEditor
            defaultCode={`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`}
          />
        </div>
      </div>
    </div>
  );
};

export default InsertionSort;
