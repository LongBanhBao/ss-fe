import { User } from "@/types/database";
import {
  LoginResponse,
  UserLogin,
  UserProfile,
  UserRegister,
  UserUpdate,
} from "@/types/user";
import { AxiosError } from "axios";
import instance from "./axios";
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
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
    throw new Error("Đã có lỗi xảy ra.");
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

export const forgotPassword = async (email: string) => {
  try {
    const response = await instance.post("/forgot", { email });
    console.log("Forgot password: ", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error("Email không tồn tại.");
    }
    console.error("Forgot password error:", error);
    throw new Error("Failed to send email.");
  }
};
