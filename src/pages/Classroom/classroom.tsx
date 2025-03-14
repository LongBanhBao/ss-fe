import React, { useEffect, useState } from "react";
import "./classroom.css";
import { useParams } from "react-router-dom";
import { ClassesResponse } from "@/types/classes";
import { getClasses } from "@/services/classes";

const Classroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<ClassesResponse | null>(null);
  const [showPosts, setShowPosts] = useState(false); // State để kiểm soát hiển thị bài đăng
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<string[]>([]); // State để lưu trữ bài đăng

  useEffect(() => {
    if (id) {
      get(id);
    }
  }, [id]);

  const get = async (id: string) => {
    try {
      const data = await getClasses(id);
      setClassroom(data);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch class");
    }
  };

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      setPosts([...posts, postContent]); // Thêm bài đăng vào danh sách
      setPostContent(""); // Xóa nội dung trong khung chatbox
    } else {
      alert("Nội dung bài đăng không được để trống!"); // Thông báo nếu nội dung trống
    }
  };

  return (
    <div className="classroom-container">
      <div className="classroom-sidebar">
        <div className="logo">
          <div className="logo-placeholder"></div>
        </div>
        <div className="class-info">
          <p>Tên lớp:</p>
          <p>Mã lớp:</p>
          <p>Giáo viên:</p>
        </div>
        <div>
          <button onClick={() => setShowPosts((pre) => !pre)}>
            {showPosts ? "Hủy" : "Viết bài"}
          </button>
        </div>
      </div>
      <div className="classroom-content">
        {classroom && classroom.students && (
          <table className="members-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Họ tên</th>
              </tr>
            </thead>
            <tbody>
              {classroom.students.map((member) => (
                <tr key={member.id}>
                  <td>{member.email}</td>
                  <td style={{ position: "relative" }}>
                    {member.first_name} {member.last_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {classroom && classroom.messages && (
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Bài tập</th>
              </tr>
            </thead>
            <tbody>
              {classroom.messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showPosts && (
          <div className="posts-container">
            {posts.map((post, index) => (
              <div key={index} className="post">
                {post}
              </div>
            ))}
          </div>
        )}

        {showPosts && (
          <div className="chatbox">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Nhập nội dung bài đăng..."
            />
            <button onClick={handlePostSubmit}>Đăng bài</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classroom;
