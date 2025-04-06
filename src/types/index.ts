// Define the types for our application

export type Student = {
  id: number;
  name: string;
  gender: "male" | "female" | "other";
};

export type Attribute = {
  id: number;
  text: string;
  category: "positive" | "improve";
};

export type StudentAttribute = {
  studentId: number;
  attributeId: number;
};
