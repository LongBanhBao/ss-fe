import { Assignment, SavedCode, User } from "./database";

export type SavedCodeCreate = Omit<
  SavedCode,
  "id" | "created_at" | "updated_at"
>;

export type SavedCodeResponse = SavedCode & {
  user: User;
  assignment: Assignment;
};
