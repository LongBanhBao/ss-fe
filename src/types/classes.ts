import { Classes, Message, User } from "./database";

export type ClassesResponse = Classes & {
  teacher: User;
  students: Array<User>;
  messages: Array<Message>;
};

export type ClassesCreate = Omit<Classes, "id" | "created_at" | "updated_at">;
