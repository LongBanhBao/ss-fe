import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListExercise.css";
import { useAuth } from "@/context/AuthContext";
import { getAllAssignments } from "@/services/assignment";
import { deleteAssignment } from "@/services/assignment";
import { AssignmentResponse } from "@/types/assignment";

const ListExercise: React.FC = () => {
  const { user, isTeacher } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("");
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [assignments, setAssignments] = useState<Array<AssignmentResponse>>([]);
  console.log("Assignments:", assignments);
  const checkOwner = (assignment: AssignmentResponse) => {
    return isTeacher && assignment.creator.id === user?.id;
  };
  const filteredAssignments = assignments
    .filter((assignment) => category === "" || assignment.category === category)
    .filter(
      (assignment) =>
        searchTitle === "" || assignment.title.includes(searchTitle)
    );
  console.log("Filtered assignments:", filteredAssignments);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    getAllAssignments()
      .then((res) => {
        setAssignments(res);
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
        alert("Error fetching assignments");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateExercise = () => {
    navigate("/create-exercise");
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    colIndex: number
  ) => {
    const startX = e.clientX;
    const startWidth = (
      tableRef.current?.rows[0].cells[colIndex] as HTMLTableCellElement
    ).offsetWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (tableRef.current) {
        tableRef.current.rows[0].cells[colIndex].style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDelete = async (id: string) => {
    deleteAssignment(id)
      .then((res) => {
        setAssignments(
          assignments.filter((assignment) => assignment.id !== res.id)
        );
      })
      .catch((error) => {
        console.error("Error deleting assignment:", error);
      });
  };

  return (
    <div className="exercise-container">
      <form className="search-box" onSubmit={() => {}}>
        <div className="form-group">
          <label>Tên bài</label>
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Nhập tên bài tập"
          />
        </div>
        <div className="form-group">
          <label>Thể loại</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="search">Tìm kiếm</option>
            <option value="sort">Sắp xếp</option>
          </select>
        </div>
        {user?.role === "teacher" && (
          <button type="button" onClick={handleCreateExercise}>
            Tạo bài tập
          </button>
        )}
      </form>

      <table className="exercise-table" ref={tableRef}>
        <thead>
          <tr>
            <th>
              Tên bài
              <div
                className="resizer"
                onMouseDown={(e) => handleMouseDown(e, 1)}
              />
            </th>
            <th>
              Thể loại
              <div
                className="resizer"
                onMouseDown={(e) => handleMouseDown(e, 2)}
              />
            </th>
            <th>
              Thao tác
              <div
                className="resizer"
                onMouseDown={(e) => handleMouseDown(e, 5)}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : filteredAssignments.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Không tìm thấy bài tập nào
              </td>
            </tr>
          ) : (
            filteredAssignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.title}</td>
                <td>{assignment.category}</td>
                <td>
                  {user?.role === "teacher" || user?.role === "admin" ? (
                    <>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/exercise/${assignment.id}`)}
                    >
                      Làm bài
                    </button>
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/exercise-detail/${assignment.id}`)
                        }
                      >
                        Xem
                      </button>
                      {checkOwner(assignment) && (
                        <>
                          <button
                            onClick={() =>
                              navigate(`/edit-exercise/${assignment.id}`)
                            }
                            className="edit-button"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(assignment.id)}
                            className="delete-button"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/exercise/${assignment.id}`)}
                    >
                      Làm bài
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListExercise;
