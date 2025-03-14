import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { Editor } from "@monaco-editor/react";
import "./Exercise.css";
import { getAssignmentById } from "@/services/assignment";
import { getSavedCode, saveCode } from "@/services/saved_code";
import { AssignmentResponse } from "@/types/assignment";
import { runPythonCode } from "@/utils/runPythonCode";
import { createSubmission } from "@/services/submission";
import { compareCode } from "@/services/ai";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

const Exercise: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [submissionSelected, setSubmissionSelected] = useState<string>("");
  const [assignment, setAssignment] = useState<AssignmentResponse>({
    id: "",
    title: "",
    description: "",
    sample_code: "",
    category: "",
    test_cases: [],
    submissions: [],
    saved_codes: [],
    creator: {
      id: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      role: "",
    },
  });
  const lastSubmission = assignment.submissions.sort((a, b) => {
    return (
      new Date(b.created_at as string).getTime() -
      new Date(a.created_at as string).getTime()
    );
  })[0];
  const [email, setEmail] = useState<string>("");
  const isOwner = assignment.creator.id === auth?.user?.id;

  const [loading, setLoading] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

  const [code, setCode] = useState<string>("");

  const [runCode, setRunCode] = useState<{ input: string; output: string }>({
    input: "",
    output: "",
  });

  const [result, setResult] = useState<{
    result: number;
    status: string;
    ran_at?: string;
  } | null>(null);

  const [message, setMessage] = useState<string>("");

  const handleSelectedChange = (id: string) => {
    setSubmissionSelected(id);
    const selectedSubmission = assignment.submissions.find((s) => s.id === id);
    console.log("selected submission: ", selectedSubmission);
    setCode(selectedSubmission?.code || "");
    setResult({
      result: selectedSubmission?.result || 0,
      status: selectedSubmission?.status || "",
      ran_at: selectedSubmission?.created_at || "",
    });
  };

  const preRunCode = () => {
    setResult(null);
    setRunning(true);
    setRunCode((pre) => ({
      input:
        pre.input === "" ? assignment.test_cases[0].input || "" : pre.input,
      output: "",
    }));
    setMessage("Đang chạy thử...");
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAssignmentById(id)
        .then((data) => {
          setAssignment(data);
          if (isOwner) {
            setCode(data.sample_code);
          }
        })
        .catch((error) => {
          console.error("Error fetching exercise data:", error);
          alert("Có lỗi xảy ra khi tải thông tin bài tập");
        })
        .finally(() => {
          setLoading(false);
        });
      if (auth.isStudent) {
        setLoading(true);
        getSavedCode(id)
          .then((data) => {
            setCode(data.code);
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setCode("");
            } else {
              console.error("Error fetching saved code:", error);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [id, auth.isStudent, isOwner]);

  const handleSaveCode = async () => {
    if (code === "") {
      alert("Vui lòng nhập code trước khi lưu");
      return;
    }
    try {
      setRunning(true);
      if (id) {
        await saveCode(id, code);
        setMessage("Code saved successfully!");
      } else {
        setMessage("Error saving code. Please try again.");
      }
    } catch (error) {
      console.error("Error saving code:", error);
      setMessage("Error saving code. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const handleRunCode = async () => {
    if (code === "") {
      alert("Vui lòng nhập code trước khi chạy");
      return;
    }
    try {
      preRunCode();
      const result = await runPythonCode(
        code,
        assignment.test_cases[0].input || ""
      );
      setRunCode((pre) => ({ ...pre, output: result?.output || "" }));
      if (result && id && result.code === 0) {
        setMessage("Đang so sánh với code mẫu...");
        const compare = await compareCode(id, code);
        setMessage(compare.message);
      } else {
        setMessage("Kết quả không hợp lệ hoặc không có ID.");
      }
    } catch (error) {
      console.error("Error running code:", error);
      alert("Có lỗi xảy ra khi chạy code");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (code === "") {
      alert("Vui lòng nhập code trước khi nộp bài");
      return;
    }
    setRunning(true);
    setMessage("Đang nộp bài...");
    try {
      const result = await runPythonCode(
        code,
        assignment.test_cases[0].input || ""
      );
      if (result && id && result.code === 0) {
        setMessage("Đang so sánh với code mẫu...");
        const compare = await compareCode(id, code);
        setMessage(compare.message);
        const submission = await createSubmission(id, code);
        setMessage("Bài nộp thành công!");
        setResult({
          result: submission.result,
          status: submission.status,
          ran_at: submission.created_at,
        });
        await saveCode(id, code);
      } else {
        setRunCode((pre) => ({ ...pre, output: result?.output || "" }));
        setMessage("Kết quả không hợp lệ hoặc không có ID.");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      alert("Có lỗi xảy ra khi nộp bài");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (assignment === null) {
    return <h1>Assignment not found</h1>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-1/3">
          <p>
            <strong>Tên bài:</strong> {assignment.title}
          </p>
          <p>
            <strong>Thể loại:</strong> {assignment.category}
          </p>
          {auth.isTeacher && (
            <>
              <p>
                <strong>{"Điểm cao nhất: "}</strong>
                {Math.max(...assignment.submissions.map((s) => s.result), 0)}
              </p>
              <p>
                <strong>{"Số lần nộp: "}</strong>
                {assignment.submissions.length}
              </p>
              {isOwner && (
                <>
                  <div>
                    <strong>{"Danh sách bài nộp: "}</strong>
                    <input
                      value={email}
                      onChange={handleChangeEmail}
                      className="w-full p-2 border-2"
                    />
                    <ul className="w-full h-32 p-2 border-2 ">
                      {assignment.submissions
                        .filter((s) => s.user.email.includes(email))
                        .map((submission) => (
                          <div
                            key={submission.id}
                            onClick={() => handleSelectedChange(submission.id)}
                            className="hover:bg-gray-300"
                          >
                            {`${submission.user.email}`}
                          </div>
                        ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
          {auth.isStudent && (
            <>
              <p>
                <strong>{"Gần nhất: "}</strong>
                {lastSubmission?.created_at
                  ? format(
                      new Date(lastSubmission.created_at),
                      "dd/MM/yyyy HH:mm:ss"
                    )
                  : "Chưa có"}
              </p>
              <p>
                <strong>Điểm cao nhất:</strong>{" "}
                {Math.max(...assignment.submissions.map((s) => s.result), 0)}
              </p>
              <p>
                <strong>Số lần nộp:</strong>{" "}
                {assignment.submissions.length || 0}
              </p>
            </>
          )}
        </div>
        <div className="w-2/3 p-2 overflow-x-auto bg-gray-100">
          <div>
            <h3>Đề bài:</h3>
            <Markdown>{assignment.description}</Markdown>
          </div>
          <div>
            <h3>Ví dụ mẫu:</h3>
            {auth.isTeacher && <p>Mẫu</p>}
            {assignment.test_cases.map((test_case) => {
              if (test_case.type === "sample") return null;
              return (
                <div key={test_case.id} className="flex gap-2 p-1 ">
                  <pre className="w-1/2 p-1 border">{test_case.input}</pre>
                  <pre className="w-1/2 p-1 border">{test_case.output}</pre>
                </div>
              );
            })}
            {auth.isTeacher && <p>Ẩn</p>}
            {assignment.test_cases.map((test_case) => {
              if (test_case.type !== "sample") return null;
              return (
                <div key={test_case.id} className="flex gap-2 p-1 ">
                  <pre className="w-1/2 p-1 border">{test_case.input}</pre>
                  <pre className="w-1/2 p-1 border">{test_case.output}</pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <Editor
            height="400px"
            defaultLanguage="python"
            value={code}
            defaultValue={isOwner ? assignment.sample_code : code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
          />
        </div>
        <div className="flex flex-col w-1/2 p-2">
          <div className="flex w-full gap-2 mb-2 h-1/4">
            <textarea
              className="w-1/2 p-2 border"
              value={runCode.input}
              onChange={(e) =>
                setRunCode((prev) => ({ ...prev, input: e.target.value }))
              }
            ></textarea>
            <textarea
              className="w-1/2 p-2 border"
              value={runCode.output}
              onChange={(e) =>
                setRunCode((prev) => ({ ...prev, output: e.target.value }))
              }
            ></textarea>
          </div>
          <div className="flex gap-2">
            {auth.isStudent && (
              <>
                <button onClick={() => handleSubmit()}>Nộp bài</button>
                <button onClick={() => handleSaveCode()}>Lưu code</button>
              </>
            )}
            <button onClick={() => handleRunCode()}>Chạy code</button>
            {auth.isTeacher && isOwner && (
              <>
                <button
                  onClick={() => {
                    if (code === assignment.sample_code) {
                      const selectedSubmission = assignment.submissions.find(
                        (s) => s.id === submissionSelected
                      );
                      console.log("selected submission: ", selectedSubmission);
                      if (selectedSubmission) {
                        setCode(selectedSubmission.code);
                        setResult({
                          result: selectedSubmission.result,
                          status: selectedSubmission.status,
                          ran_at: selectedSubmission.created_at,
                        });
                      } else {
                        console.warn("No submission found.");
                      }
                    } else {
                      setCode(assignment.sample_code);
                    }
                  }}
                >
                  {code === assignment.sample_code
                    ? "Code bài nộp"
                    : "Xem bài mẫu"}
                </button>
              </>
            )}
            {running && <span>Đang chạy...</span>}
          </div>
          {message !== "" && (
            <div className="flex flex-col w-full gap-2">
              <div>
                Message:
                <pre className="whitespace-pre-wrap">{message}</pre>
              </div>
            </div>
          )}
          {result && (
            <div>
              <div>
                Thời gian chạy:{" "}
                <pre className="whitespace-pre-wrap">
                  {result.ran_at
                    ? format(new Date(result.ran_at), "dd/MM/yyyy HH:mm:ss")
                    : "Chưa chạy"}
                </pre>
              </div>
              <div>
                Kết quả:
                <pre className="whitespace-pre-wrap">{result.result}</pre>
              </div>
              <div>
                Trạng thái:
                <pre className="whitespace-pre-wrap">{result.status}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Exercise;
