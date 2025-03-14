export type Metadata = {
  id: string;
  created_at?: string;
  updated_at?: string;
};
export type User = Metadata & {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  role: string;
};

export type Assignment = Metadata & {
  title: string;
  description: string;
  sample_code: string;
  category: string;
};

export type TestCase = Metadata & {
  input: string;
  output: string;
  type: string;
};

export type Submission = Metadata & {
  code: string;
  status: string;
  result: number;
};

export type SavedCode = Metadata & {
  code: string;
};

export type Classes = Metadata & {
  title: string;
  description: string;
  class_code: string;
  image_url: string | null;
};

export type AiAssignment = {
  message: string;
};

export type Message = Metadata & {
  content: string;
};
