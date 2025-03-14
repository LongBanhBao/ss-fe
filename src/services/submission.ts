import { SubmissionResponse } from "@/types/submission";
import instance from "./axios";

export const createSubmission = async (
  assignment_id: string,
  code: string
): Promise<SubmissionResponse> => {
  try {
    const response = await instance.post(`/submissions/${assignment_id}`, {
      code,
    });
    console.log("Submission: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Create Submission error:", error);
    throw error;
  }
};
