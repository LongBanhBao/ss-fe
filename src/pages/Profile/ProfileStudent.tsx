import React, { useEffect, useState } from "react";
import "./ProfileStudent.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/user";
import { getProfile } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Assignment } from "@/types/database";

const ProfileUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const auth = useAuth();
  const submissions = profile?.submissions || [];
  const createdAssignments = profile?.created_assignments || [];

  console.log("created assignments: ", createdAssignments);

  const assignments: Assignment[] = Array.from(
    new Set(
      submissions.map((submission) => JSON.stringify(submission.assignment))
    )
  ).map((assignment) => JSON.parse(assignment));

  const assignment_scores = submissions.reduce(
    (acc: { id: string; result: number }[], submission) => {
      const { assignment, result } = submission;
      const assignmentId = assignment.id;
      acc.push({ id: assignmentId, result });
      return Array.from(new Set(acc.map((a) => JSON.stringify(a)))).map((a) =>
        JSON.parse(a)
      );
    },
    []
  );

  useEffect(() => {
    if (id) {
      getProfile(id)
        .then((res) => {
          setProfile(res);
        })
        .catch((error) => {
          console.log(error);
          setError("Lỗi khi lấy thông tin sinh viên");
        });
    }
  }, [id]);

  const handleUpdateClick = () => {
    navigate(`/update-profile/${id}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-wrapper">
      {/* Phần thông tin sinh viên - bên trái */}
      <div className="profile-info-section">
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar">
            <div className="avatar-circle">
              <img
                src="https://api.dicebear.com/9.x/bottts/svg"
                alt="Avatar"
                className="avatar-img"
              />
            </div>
          </div>

          {/* Thông tin sinh viên */}
          <div className="info-block">
            <div className="info-header">
              Thông tin{" "}
              {auth.user?.role === "student" ? "sinh viên" : "giáo viên"}
            </div>
            <div className="info-content">
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{profile?.email || ""}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Họ tên:</span>
                <span className="info-value">{`${profile?.first_name || ""} ${
                  profile?.last_name || ""
                }`}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ngày sinh:</span>
                <span className="info-value">
                  {profile?.date_of_birth
                    ? format(new Date(profile.date_of_birth), "dd/MM/yyyy")
                    : "Chưa cập nhật"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Vai trò:</span>
                <span className="info-value">
                  {profile?.role === "student" ? "Học sinh" : "Giáo viên"}
                </span>
              </div>
            </div>
          </div>

          {auth.user?.id === profile?.id && (
            <div className="flex justify-end p-4">
              <button onClick={handleUpdateClick}>
                Cập nhật thông tin cá nhân
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phần thông tin học tập - bên phải */}
      <div className="academic-info-section">
        {/* Danh sách bài tập */}
        {submissions.length > 0 && (
          <div className="exercises-card">
            <h2 className="section-title">Danh sách bài tập đã làm</h2>
            <div className="exercises-list">
              <table className="exercises-table">
                <thead>
                  <tr>
                    <th>Tên bài tập</th>
                    <th>Điểm cao nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments
                    .sort(
                      (a, b) =>
                        new Date(b.created_at as string).getTime() -
                        new Date(a.created_at as string).getTime()
                    )
                    .map((assignment) => (
                      <tr key={assignment.id} className={`font-bold`}>
                        <td>
                          <Link to={`/exercise/${assignment.id}`}>
                            {assignment.title}
                          </Link>
                        </td>
                        <td>
                          {Math.max(
                            ...assignment_scores
                              .filter((a) => a.id === assignment.id)
                              .map((a) => a.result)
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {createdAssignments.length > 0 && (
          <div className="exercises-card">
            <h2 className="section-title">Danh sách bài tập đã tạo</h2>
            <div className="exercises-list">
              <table className="exercises-table">
                <thead>
                  <tr>
                    <th>Tên bài tập</th>
                    <th>Số bài nộp</th>
                    <th>Số bài đạt</th>
                  </tr>
                </thead>
                <tbody>
                  {createdAssignments
                    .sort(
                      (a, b) =>
                        new Date(b.created_at as string).getTime() -
                        new Date(a.created_at as string).getTime()
                    )
                    .map((assignment) => (
                      <tr key={assignment.id} className={`font-bold`}>
                        <td>
                          <Link to={`/exercise/${assignment.id}`}>
                            {assignment.title}
                          </Link>
                        </td>
                        <td>{assignment.submissions.length}</td>
                        <td>
                          {
                            assignment.submissions.filter(
                              (s) => s.status === "PASSED"
                            ).length
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUser;
