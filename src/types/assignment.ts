import { Assignment, SavedCode, Submission, TestCase, User } from "./database";

export type AssignmentCreate = Omit<
  Assignment,
  "id" | "created_at" | "updated_at"
> & {
  test_cases: Array<Omit<TestCase, "id" | "created_at" | "updated_at">>;
};

export type AssignmentWithTestCase = Assignment & {
  test_cases: Array<TestCase>;
};

export type AssignmentResponse = Assignment & {
  creator: User;
  test_cases: Array<TestCase>;
  submissions: Array<Submission & { user: User }>;
  saved_codes: Array<SavedCode>;
};

export type AssignmentUpdate = Omit<
  Assignment,
  "id" | "created_at" | "updated_at"
> & { test_cases: Array<Omit<TestCase, "id" | "created_at" | "updated_at">> };
