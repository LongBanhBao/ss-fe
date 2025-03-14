import instance from "./axios";
import {
  UserRegister,
  UserLogin,
  UserProfile,
  UserUpdate,
  LoginResponse,
} from "@/types/user";
import { User } from "@/types/database";
export const register = async (user: UserRegister) => {
  try {
    const response = await instance.post("/register", user);
    console.log("Register: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Register error:", error);
    throw new Error("Register Failed");
  }
};

export const login = async (user: UserLogin): Promise<LoginResponse> => {
  try {
    const response = await instance.post("/login", user, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    localStorage.setItem("token", response.data["access_token"]);
    return response.data;
  } catch (error: unknown) {
    console.error("Login error:", error);
    if (error instanceof Error && (error as any).response?.status === 401) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
    throw new Error(
      "Đã có lỗi xảy ra."
    );
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getUser = async (): Promise<User> => {
  try {
    const response = await instance.get("/me");
    console.log("GetUser: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw new Error("Failed to get user data.");
  }
};

export const getProfile = async (user_id: string): Promise<UserProfile> => {
  try {
    const response = await instance.get(`/profile/${user_id}`);
    console.log("Profile: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Profile error:", error);
    throw new Error("Failed to get user data.");
  }
};

export const updateProfile = async (data: UserUpdate): Promise<User> => {
  try {
    const response = await instance.put("/update", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw new Error("Failed to update profile.");
  }
};
