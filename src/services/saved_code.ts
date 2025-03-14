import instance from "./axios";
import { SavedCodeResponse } from "@/types/savedcode";

export const saveCode = async (
  id: string,
  code: string
): Promise<SavedCodeResponse> => {
  try {
    const response = await instance.post(`/savedcodes/${id}`, { code });
    return response.data;
  } catch (error) {
    console.error("Error saving code:", error);
    throw error;
  }
};

export const getSavedCode = async (id: string): Promise<SavedCodeResponse> => {
  try {
    const response = await instance.get(`/savedcodes/${id}`);
    console.log("Saved code:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting saved code:", error);
    throw error;
  }
};
