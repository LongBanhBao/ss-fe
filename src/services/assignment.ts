import instance from "./axios";
import {
  AssignmentCreate,
  AssignmentResponse,
  AssignmentUpdate,
  AssignmentWithTestCase,
} from "@/types/assignment";

export const createAssignment = async (
  data: AssignmentCreate
): Promise<AssignmentWithTestCase> => {
  try {
    const response = await instance.post("/assignments", data);
    console.log("Created assignment:", response);
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to create assignment:", error);
    throw new Error(`Failed to create assignme`);
  }
};

export const getAssignmentById = async (
  id: string
): Promise<AssignmentResponse> => {
  try {
    const response = await instance.get(`/assignments/${id}`);
    console.log("Assignment Get: ", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to get assignment:", error);
    throw new Error(`Failed to get assignment:`);
  }
};

export const getAllAssignments = async (): Promise<
  Array<AssignmentResponse>
> => {
  try {
    const response = await instance.get("/assignments");
    return response.data;
  } catch (error: unknown) {
    console.error(`Failed to get assignments`, error);
    throw new Error(`Failed to get assignments`);
  }
};

export const deleteAssignment = async (
  id: string
): Promise<AssignmentWithTestCase> => {
  try {
    const response = await instance.delete(`/assignments/${id}`);
    console.log("Deleted assignment:", response);
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to delete assignment:", error);
    throw new Error(`Failed to delete assignment`);
  }
};

export const updateAssignment = async (
  id: string,
  data: AssignmentUpdate
): Promise<AssignmentWithTestCase> => {
  try {
    const response = await instance.put(`/assignments/${id}`, data);
    console.log("Updated assignment:", response);
    return response.data;
  } catch (error: unknown) {
    console.error("Failed to delete assignment:", error);
    throw new Error(`Failed to update assignment`);
  }
};
