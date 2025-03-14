import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import CodeEditor from "../../components/CodeEditor";
import "./TKTT.css"; // Import the CSS file

interface Step {
  index: number;
  value: number | null;
  isMatch: boolean;
  description: string;
}

const TKTT: React.FC = () => {
  const [array, setArray] = useState<number[]>([1, 4, 7, 8, 3, 9, 10]);
  const [arrayInput, setArrayInput] = useState<string>("1,4,7,8,3,9,10");
  const [k, setK] = useState<number>(3);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [searchSteps, setSearchSteps] = useState<Step[]>([]);
  const [leftWidth, setLeftWidth] = useState<number>(33); // Chiều rộng khung trái (%)
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pythonCode = `
def linear_search(A, K):
    for i in range(len(A)):
        if A[i] == K:  # So sánh giá trị tại A[i] với K
            return i  # Trả về chỉ số nếu tìm thấy
    return -1  # Trả về -1 nếu không tìm thấy

# Nhập dãy số từ người dùng
A = list(map(int, input("Nhập các phần tử của mảng (cách nhau bởi dấu phẩy): ").split(',')))
K = int(input("Nhập giá trị cần tìm: "))

# Thực hiện tìm kiếm và in kết quả
index = linear_search(A, K)
if index != -1:
    print(f"Giá trị {K} được tìm thấy tại vị trí: {index}")
else:
    print(f"Không tìm thấy giá trị {K} trong mảng.")
`;

  useEffect(() => {
    const steps = linear_search_with_steps(array, k);
    setSearchSteps(steps);
    setCurrentStep(0);
  }, [array, k]);

  useEffect(() => {
    if (isRunning && currentStep < searchSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentStep >= searchSteps.length) {
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

  const handleArrayInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArrayInput(e.target.value);
    const newArray = e.target.value
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    setArray(newArray);
  };

  const currentStepData = searchSteps[currentStep] || {
    index: -1,
    value: null,
    isMatch: false,
  };

  const linear_search_with_steps = (arr: number[], target: number): Step[] => {
    const steps: Step[] = [];

    // Thêm bước đầu tiên
    steps.push({
      index: -1,
      value: null,
      isMatch: false,
      description: "Bắt đầu thuật toán",
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        index: i,
        value: arr[i],
        isMatch: arr[i] === target,
        description: `So sánh A[${i}] = ${arr[i]} với ${target}`,
      });
      if (arr[i] === target) {
        // Thêm bước thông báo kết quả khi tìm thấy
        steps.push({
          index: i,
          value: arr[i],
          isMatch: true,
          description: `Tìm thấy k tại vị trí ${i} trong mảng`,
        });
        return steps;
      }
    }

    // Thêm bước thông báo kết quả khi không tìm thấy
    steps.push({
      index: -1,
      value: null,
      isMatch: false,
      description: "Không tìm thấy k trong mảng",
    });
    return steps;
  };

  // Thêm ref cho container chứa các bước
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // Thêm handler cho việc click vào bước
  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsRunning(false);
  };

  // Thêm useEffect để tự động scroll đến bước hiện tại
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

  // Xử lý sự kiện kéo resize
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

      // Loại bỏ requestAnimationFrame và làm tròn ít hơn
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(Math.round(newLeftWidth * 2) / 2); // Làm tròn đến 0.5
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
        Bài học &gt; Thuật toán tìm kiếm &gt; thuật toán tìm kiếm tuần tự
      </div>

      {/* Main content với resizer */}
      <div className="flex space-x-4 relative" ref={containerRef}>
        {/* Steps section */}
        <div
          className="bg-gray-100 p-4 rounded h-[500px]"
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
          {/* Input for array */}
          <div className="mt-4">
            <input
              type="text"
              value={arrayInput}
              onChange={handleArrayInputChange}
              placeholder="Nhập dãy số (cách nhau bởi dấu phẩy)"
              className="border rounded px-2 py-1 w-full mb-4"
            />
          </div>

          <div className="flex mb-4 items-center">
            <p className="mr-4 text-lg font-bold flex-shrink-0">A=</p>
            <div className="flex flex-wrap">
              {array.map((num, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-2 text-lg font-semibold
                  ${
                    index === currentStepData.index
                      ? "bg-yellow-300"
                      : index < currentStepData.index
                      ? "bg-green-400"
                      : "bg-purple-400"
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
                    index === currentStepData.index
                      ? "bg-yellow-300"
                      : index < currentStepData.index
                      ? "bg-green-400"
                      : "bg-purple-400"
                  }`}
                >
                  {index}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-4 rounded">
            {currentStepData.index !== -1 ? (
              <>
                <p className="font-bold mb-2">
                  Bước {currentStep}: so sánh A[{currentStepData.index}] ={" "}
                  {currentStepData.value} với k = {k}
                </p>
                <p>
                  A[{currentStepData.index}] = {currentStepData.value}
                  {currentStepData.isMatch ? " = " : " ≠ "} k
                </p>
                {!currentStepData.isMatch &&
                  currentStepData.index < array.length - 1 && (
                    <p>tăng i: i + 1 = {currentStepData.index + 1}</p>
                  )}
              </>
            ) : (
              // Hiển thị thông báo kết quả cuối cùng nếu là bước cuối
              currentStep === searchSteps.length - 1 && (
                <p className="font-bold">
                  {searchSteps[searchSteps.length - 1].description}
                </p>
              )
            )}
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
        <CodeEditor
          defaultCode={pythonCode}
          defaultInput={`1,4,7,8,3,9,10\n4`}
        />
      </div>
    </div>
  );
};

export default TKTT;
