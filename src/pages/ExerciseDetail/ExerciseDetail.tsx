import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ExerciseDetail.css";
import { getAssignmentById } from "@/services/assignment";
import { AssignmentResponse } from "@/types/assignment";
import { useAuth } from "@/context/AuthContext";

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const [data, setData] = useState<AssignmentResponse | null>(null);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const submissions =
    data?.submissions
      .sort((a, b) => {
        return (
          new Date(b.created_at as string).getTime() -
          new Date(a.created_at as string).getTime()
        );
      })
      .filter((submission) => submission.status === status || status === "")
      .filter(
        (submission) => submission.id === submissionId || submissionId === ""
      ) || [];

  const statusList = Array.from(
    new Set(submissions.map((submission) => submission.status))
  );

  console.log("statusList", statusList);

  const handleSelectedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmissionId(e.target.value);
  };

  useEffect(() => {
    if (id) {
      getAssignmentById(id)
        .then((res) => {
          setData(res);
          setSubmissionId("");
        })
        .catch((error) => {
          console.error("Error fetching assignment:", error);
          alert("Error fetching assignment");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!data) {
    return <div className="error">Không tìm thấy bài tập</div>;
  }

  return (
    <div className="exercise-detail">
      <div className="header">
        <h1>{data.title}</h1>
        <div className="category">Thể loại: {data.category}</div>
      </div>

      <div className="description">
        <h2>Mô tả</h2>
        <p>{data.description}</p>
      </div>

      <div className="testcases">
        <h2>Test cases</h2>
        <p>Mẫu</p>
        {data.test_cases.map((testcase) => {
          if (testcase.type !== "sample") return null;
          return (
            <div key={testcase.id} className="testcase flex gap-2">
              <div className="testcase-input w-1/2">
                <h3>Input:</h3>
                <pre>{testcase.input}</pre>
              </div>
              <div className="testcase-output w-1/2">
                <h3>Output:</h3>
                <pre>{testcase.output}</pre>
              </div>
            </div>
          );
        })}
        <p>Ẩn</p>
        {data.test_cases.map((testcase) => {
          if (testcase.type === "sample") return null;
          return (
            <div key={testcase.id} className="testcase flex gap-2">
              <div className="testcase-input w-1/2">
                <h3>Input:</h3>
                <pre>{testcase.input}</pre>
              </div>
              <div className="testcase-output w-1/2">
                <h3>Output:</h3>
                <pre>{testcase.output}</pre>
              </div>
            </div>
          );
        })}
      </div>
      {auth.isTeacher && submissions.length > 0 && (
        <>
          <div className="code-section">
            <h2>Code mẫu</h2>
            <pre className="sample-code">
              <code>{data.sample_code}</code>
            </pre>
          </div>
          <div className="submissions">
            <h2>Danh sách bài nộp</h2>
            <div className="flex gap-4">
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tất cả</option>
                {statusList.map((s, index) => (
                  <option key={index} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                name="submission_id"
                value={submissionId}
                onChange={handleSelectedChange}
              >
                <option value="">Tất cả</option>
                {submissions.map((submission) => {
                  return (
                    <option key={submission.id} value={submission.id}>
                      {submission.id}
                    </option>
                  );
                })}
              </select>
            </div>
            {submissions.map((submission) => {
              const colorText =
                submission.status.toLowerCase() === "passed"
                  ? "text-green-500"
                  : "text-red-500";
              return (
                <div className="submission" key={submission.id}>
                  <div className={`${colorText} flex gap-4`}>
                    <strong>{submission.status}</strong>
                    <strong>{submission.result}</strong>
                  </div>
                  <pre className="sample-code">
                    <code>{submission.code}</code>
                  </pre>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseDetail;
