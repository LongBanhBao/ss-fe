import { AiAssignment } from "@/types/database";
import instance from "./axios";

export const compareCode = async (
  assignment_id: string,
  code: string
): Promise<AiAssignment> => {
  try {
    const response = await instance.post(`/ai/assignments/${assignment_id}`, {
      user_code: code,
    });
    console.log("Ai Compare Code: ", response.data);
    return response.data;
  } catch (error) {
    console.error("AI Compare Code error: ", error);
    throw new Error("Compare code failed");
  }
};
