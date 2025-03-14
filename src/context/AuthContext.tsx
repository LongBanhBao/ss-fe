import { User } from "@/types/database";
import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "@/services/auth";

const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}>({
  user: null,
  isAuthenticated: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isTeacher: false,
  isStudent: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Đặt trạng thái ban đầu là null
  const [loading, setLoading] = useState<boolean>(true); // Thêm trạng thái loading

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser()
        .then((res) => {
          setUser(res);
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const isTeacher = user?.role === "teacher";
  const isStudent = user?.role === "student";

  const login = (token: string) => {
    localStorage.setItem("token", token);
    getUser().then((res) => setUser(res));
    setIsAuthenticated(true);
    setLoading(false);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading,
        user,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
