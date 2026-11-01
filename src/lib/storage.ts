import type { CategoryId, FeedbackSubmission, Resource, User } from "../types";
import { SEED_RESOURCES } from "../constants";

const RESOURCES_KEY = "library_resources_v1";
const USER_KEY = "library_user_v1";
const FEEDBACK_KEY = "library_feedback_v1";

export function filterResources(
  resources: Resource[],
  query: string,
  activeCategory: CategoryId | "all"
): Resource[] {
  const q = query.trim().toLowerCase();
  return resources.filter((r) => {
    const matchCategory = activeCategory === "all" || r.category === activeCategory;
    if (!matchCategory) return false;
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });
}

export function loadResources(): Resource[] {
  try {
    const raw = localStorage.getItem(RESOURCES_KEY);
    if (!raw) {
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(SEED_RESOURCES));
      return SEED_RESOURCES;
    }
    const parsed = JSON.parse(raw) as Resource[];
    if (!Array.isArray(parsed)) return SEED_RESOURCES;
    return parsed;
  } catch {
    return SEED_RESOURCES;
  }
}

export function saveResources(resources: Resource[]): void {
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
}

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function loadFeedback(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedbackSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFeedback(feedback: FeedbackSubmission[]): void {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
}
