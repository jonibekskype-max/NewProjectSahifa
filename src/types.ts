export type CategoryId =
  | "badiiy"
  | "darslik"
  | "maqola"
  | "test";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Resource {
  id: string;
  title: string;
  author: string;
  category: CategoryId;
  description: string;
  link: string;
  createdAt: number;
  addedBy: string;
}

export interface User {
  id: string;
  name: string;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  contact: string;
  message: string;
  createdAt: number;
}
