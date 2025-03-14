import { ClassesCreate, ClassesResponse } from "@/types/classes";
import instance from "./axios";

export const getAllClasses = async (): Promise<Array<ClassesResponse>> => {
  try {
    const response = await instance.get("/classes");
    console.log("All Classes: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch classes");
  }
};

export const getClasses = async (
  class_id: string
): Promise<ClassesResponse> => {
  try {
    const response = await instance.get(`/classes/${class_id}`);
    console.log("Class: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch class");
  }
};

export const createClass = async (
  data: ClassesCreate
): Promise<ClassesResponse> => {
  try {
    const response = await instance.post("/classes", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create class");
  }
};
