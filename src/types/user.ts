import { Assignment, Classes, Submission, User } from "./database";
export type UserRegister = Omit<
  User & {
    password: string;
  },
  "id"
>;

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type UserLogin = {
  username: string;
  password: string;
};

export type UserProfile = User & {
  created_classes: Array<Classes>;
  my_class: Classes | null;
  created_assignments: Array<Assignment & { submissions: Array<Submission> }>;
  submissions: Array<Submission & { assignment: Assignment }>;
};

export type UserUpdate = {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
};
