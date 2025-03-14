import { Assignment, Submission, User } from "./database";

export type SubmissionCreate = Omit<
  Submission,
  "id" | "created_at" | "updated_at"
>;

export type SubmissionResponse = Submission & {
  user: User;
  assignment: Assignment;
};
