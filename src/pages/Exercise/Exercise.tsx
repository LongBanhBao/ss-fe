import { useAuth } from "@/context/AuthContext";
import { compareCode } from "@/services/ai";
import { getAssignmentById } from "@/services/assignment";
import { getSavedCode, saveCode } from "@/services/saved_code";
import { createSubmission } from "@/services/submission";
import { AssignmentResponse } from "@/types/assignment";
import { runPythonCode } from "@/utils/runPythonCode";
import { Editor } from "@monaco-editor/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import "./Exercise.css";

const SAVE = "saved";
const SAMPLE = "sample";
const SUBMISSION = "submission";

const Exercise: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [email, setEmail] = useState<string>("");
  const [mode, setMode] = useState<string>(auth.isTeacher ? SAMPLE : SAVE);

  const [code, setCode] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [subId, setSubId] = useState<string>("");

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

  const handleSetMode = (mode: string) => {
    setMode(mode);
    setResult(null);
    setMessage("");
    if (mode === "sample") {
      setCode(assignment.sample_code);
    } else if (mode === "saved") {
      getSavedCode(id as string)
        .then((data) => {
          setCode(data.code);
        })
        .catch((error) => {
          setCode("Không có code đã lưu");
          console.error("Error fetching saved code:", error);
        });
    } else if (mode === "submission") {
      setCode("");
    }
  };

  const handleChooseUser = (id: string) => {
    setUserId(id);
    const submission = assignment.submissions
      .filter((s) => s.user.id === id)
      .sort()[0];
    setCode(submission ? submission.code : "No code available");
    setResult({
      result: submission.result,
      status: submission.status,
      ran_at: submission.created_at,
    });
  };

  const handleSetSubId = (id: string) => {
    setSubId(id);
    const submission = assignment.submissions.filter((s) => s.id === id)[0];
    setCode(submission ? submission.code : "No code available");
    setResult({
      result: submission.result,
      status: submission.status,
      ran_at: submission.created_at,
    });
  };

  const hiddenTestCases = assignment.test_cases.filter(
    (test_case) => test_case.type === "hidden"
  );
  const sampleTestCases = assignment.test_cases.filter(
    (test_case) => test_case.type === "sample"
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

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

  const isOwner = assignment.creator.id === auth?.user?.id;

  // Danh sach nguoi nop bai loc theo email
  const usersSubmited = [
    ...new Map(
      assignment.submissions.map((item) => [item.user.id, item.user])
    ).values(),
  ].filter((user) => user.email.includes(email));

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAssignmentById(id)
        .then((data) => {
          setAssignment(data);
          if (mode === SAMPLE && isOwner) setCode(data.sample_code);
        })
        .catch((error) => {
          console.error("Error fetching exercise data:", error);
          setMessage("Có lỗi xảy ra khi tải thông tin bài tập");
        })
        .finally(() => {
          setLoading(false);
        });
      if (auth.isStudent) {
        setLoading(true);
        getSavedCode(id)
          .then((data) => {
            if (mode === SAVE) setCode(data.code);
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setCode("Không có code đã lưu");
            } else {
              console.error("Error fetching saved code:", error);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [id, auth.isStudent, isOwner, mode]);

  const handleSaveCode = async () => {
    if (code === "") {
      alert("Vui lòng nhập code trước khi lưu");
      return;
    }
    try {
      setRunning(true);
      if (id) {
        await saveCode(id, code);
        setMessage("Code đã được lưu.");
      } else {
        setMessage("Code chưa được lưu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error saving code:", error);
      setMessage("Code chưa được lưu. Vui lòng thử lại.");
    } finally {
      setRunning(false);
    }
  };

  const preRunCode = () => {
    setResult(null);
    setRunning(true);
    setRunCode((pre) => ({
      input: pre.input === "" ? sampleTestCases[0].input || "" : pre.input,
      output: "",
    }));
    setMessage("Đang chạy thử...");
  };

  const handleRunCode = async () => {
    if (code === "") {
      alert("Vui lòng nhập code trước khi chạy");
      return;
    }
    try {
      preRunCode();
      const result = await runPythonCode(code, sampleTestCases[0].input || "");
      setRunCode((pre) => ({ ...pre, output: result?.output || "" }));
      if (result && id && result.code === 0) {
        if (mode === SAMPLE && auth.isTeacher) {
          setMessage("Code chạy thành công");
          return;
        }
        setMessage("Đang so sánh với code mẫu...");
        const compare = await compareCode(id, code);
        setMessage(compare.message);
      } else {
        setMessage("Code không chạy được. Vui lòng điều chỉnh và thử lại");
      }
    } catch (error) {
      console.error("Error running code:", error);
      setMessage("Có lỗi xảy ra khi chạy code");
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
        setMessage("Code không chạy được. Vui lòng điều chỉnh và thử lại");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setMessage("Có lỗi xảy ra khi nộp bài");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return <h1>Đang tải bài tập...</h1>;
  }

  if (assignment === null) {
    return <h1>Không tìm thấy bài tập</h1>;
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
          <select
            value={mode}
            onChange={(e) => handleSetMode(e.target.value as string)}
            className="p-2 border-2"
          >
            {auth.isTeacher && isOwner && <option value="sample">Mẫu</option>}
            {auth.isStudent && <option value="saved">Code đã lưu</option>}
            {auth.isStudent && <option value="submission">Nộp bài</option>}
            {auth.isTeacher && !isOwner && (
              <option value="submission">Không có quyền</option>
            )}
          </select>
          {auth.isTeacher && !isOwner ? (
            <></>
          ) : (
            <div>
              <p>
                <strong>{"Điểm cao nhất: "}</strong>
                {Math.max(...assignment.submissions.map((s) => s.result), 0)}
              </p>
              <p>
                <strong>{"Số lần nộp: "}</strong>
                {assignment.submissions.length || 0}
              </p>
            </div>
          )}
          {mode === SUBMISSION && auth.isTeacher && (
            <div>
              <input
                placeholder="Nhập thông tin ở đây"
                className="p-2 border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="h-32 overflow-scroll">
                {usersSubmited.map((user) => {
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleChooseUser(user.id)}
                      className={`p-2 border cursor-pointer ${
                        user.id === userId ? "bg-gray-200" : ""
                      }`}
                    >
                      {user.email}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {mode === SUBMISSION && auth.isStudent && (
            <div className="h-32 overflow-scroll">
              {assignment.submissions.map((s) => {
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSetSubId(s.id)}
                    className={`p-2 border cursor-pointer overflow-x-auto ${
                      s.id === subId ? "bg-gray-200" : ""
                    }`}
                  >
                    {format(
                      new Date(s.created_at as string),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="w-2/3 p-2 overflow-x-auto bg-gray-100">
          <div>
            <h3>Đề bài:</h3>
            <Markdown>{assignment.description}</Markdown>
          </div>
          <div>
            {!auth.isTeacher && <p>Bài mẫu:</p>}
            {auth.isTeacher && <p>Mẫu</p>}
            {sampleTestCases.map((test_case) => {
              return (
                <div key={test_case.id} className="flex gap-2 p-1 ">
                  <pre className="w-1/2 p-1 border">{test_case.input}</pre>
                  <pre className="w-1/2 p-1 border">{test_case.output}</pre>
                </div>
              );
            })}
            {auth.isTeacher && isOwner && <p>Ẩn</p>}
            {hiddenTestCases.map((test_case) => {
              return (
                <div key={test_case.id} className="flex gap-2 p-1">
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
            defaultValue={""}
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
                {mode !== SUBMISSION && (
                  <button onClick={() => handleSubmit()}>Nộp bài</button>
                )}
                <button onClick={() => handleSaveCode()}>Lưu code</button>
              </>
            )}
            <button onClick={() => handleRunCode()}>Chạy code</button>
            {auth.isTeacher && isOwner && <></>}
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
