import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateExercise.css";
import { AssignmentCreate } from "@/types/assignment";
import { createAssignment } from "@/services/assignment";
import Editor from "@monaco-editor/react";

const CreateExercise: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AssignmentCreate>({
    title: "",
    description: "",
    sample_code: "",
    category: "search",
    test_cases: [{ input: "", output: "", type: "sample" }],
  });
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setForm((prev) => ({
      ...prev,
      category: selectedCategory,
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
      test_cases: [...prev.test_cases, { input: "", output: "", type: "" }],
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
      const response = await createAssignment(form);
      console.log("Created assignment:", response);
      navigate(`/exercise-detail/${response["id"]}`);
    } catch (error) {
      console.error("Failed to create assignment", error);
    }
  };

  return (
    <div className="create-exercise">
      <h1>Tạo bài tập mới</h1>
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
          <label htmlFor="category">Thể loại</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleCategoryChange}
            required
          >
            <option value="search" selected>
              Tìm kiếm
            </option>
            <option value="sort">Sắp xếp</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            placeholder="Nhập mô tả bài tập"
            value={form.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Code mẫu</label>
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
            Tạo bài tập
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

export default CreateExercise;
