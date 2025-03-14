import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditExercise.css";
import { AssignmentUpdate } from "@/types/assignment";
import { updateAssignment, getAssignmentById } from "@/services/assignment";
import { Editor } from "@monaco-editor/react";

const EditExercise: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<AssignmentUpdate>({
    title: "",
    description: "",
    sample_code: "",
    category: "",
    test_cases: [{ input: "", output: "", type: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get(id as string);
  }, [id]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      const res = await getAssignmentById(id);
      setForm({
        title: res.title,
        description: res.description,
        category: res.category,
        sample_code: res.sample_code as string,
        test_cases: res.test_cases.map((testcase) => ({
          input: testcase.input,
          output: testcase.output,
          type: testcase.type,
        })),
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestcaseChange = (
    index: number,
    field: "input" | "output" | "type",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      test_cases: prev.test_cases.map((testcase, i) =>
        i === index ? { ...testcase, [field]: value } : testcase
      ),
    }));
  };

  const addTestcase = () => {
    setForm((prev) => ({
      ...prev,
      test_cases: [
        ...prev.test_cases,
        { input: "", output: "", type: "sample" },
      ],
    }));
  };

  const removeTestcase = (index: number) => {
    setForm((prev) => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", form);
    try {
      await updateAssignment(id as string, form);
      navigate(`/exercise-detail/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update assignment");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-exercise">
      <h1>Chỉnh sửa bài tập</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sample_code">Code mẫu</label>
          <Editor
            height="200px"
            defaultLanguage="python"
            value={form.sample_code}
            onChange={(value) => {
              setForm((prev) => ({ ...prev, sample_code: value || "" }));
            }}
            theme="vs-dark"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Thể loại</label>
          <input
            type="text"
            id="category"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="testcases-section">
          <h2>Test cases</h2>
          {form.test_cases.map((testcase, index) => (
            <div key={index} className="testcase-group">
              <h3>Test case {index + 1}</h3>
              <div className="form-group">
                <label htmlFor="category">Thể loại</label>
                <select
                  id="type"
                  value={testcase.type}
                  onChange={(e) =>
                    handleTestcaseChange(index, "type", e.target.value)
                  }
                  required
                >
                  <option value="sample" selected>
                    Mẫu
                  </option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
              <div className="form-group">
                <label>Input</label>
                <textarea
                  value={testcase.input}
                  onChange={(e) =>
                    handleTestcaseChange(index, "input", e.target.value)
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Output</label>
                <textarea
                  value={testcase.output}
                  onChange={(e) =>
                    handleTestcaseChange(index, "output", e.target.value)
                  }
                  required
                />
              </div>
              {form.test_cases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcase(index)}
                  className="remove-testcase"
                >
                  Xóa test case
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addTestcase} className="add-testcase">
            Thêm test case
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Cập nhật
          </button>
          <button
            type="button"
            onClick={() => navigate("/list-exercise")}
            className="cancel-button"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercise;
