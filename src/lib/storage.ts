import type {
  CategoryId,
  FeedbackSubmission,
  Resource,
  ResourceSummary,
  SortOption,
  User,
} from "../types";
import { SEED_RESOURCES } from "../constants";

const RESOURCES_KEY = "library_resources_v1";
const USER_KEY = "library_user_v1";
const FEEDBACK_KEY = "library_feedback_v1";
const READ_IDS_KEY = "library_read_ids_v1";

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

export function sortResources(
  resources: Resource[],
  sortBy: SortOption
): Resource[] {
  return [...resources].sort((a, b) => {
    if (sortBy === "popular") {
      const diff = (b.downloads ?? 0) - (a.downloads ?? 0);
      if (diff !== 0) return diff;
    }
    return b.createdAt - a.createdAt;
  });
}

export function toggleReadResource(
  readIds: string[],
  resourceId: string
): string[] {
  if (readIds.includes(resourceId)) {
    return readIds.filter((id) => id !== resourceId);
  }
  return [...readIds, resourceId];
}

export function incrementResourceDownloads(
  resources: Resource[],
  resourceId: string
): Resource[] {
  return resources.map((r) =>
    r.id === resourceId ? { ...r, downloads: (r.downloads ?? 0) + 1 } : r
  );
}

export function computeResourceSummary(resources: Resource[]): ResourceSummary {
  let badiiy = 0;
  let darslik = 0;
  let articles = 0;
  let tests = 0;
  let totalDownloads = 0;

  for (const r of resources) {
    if (r.category === "badiiy") badiiy += 1;
    else if (r.category === "darslik") darslik += 1;
    else if (r.category === "maqola") articles += 1;
    else if (r.category === "test") tests += 1;
    totalDownloads += r.downloads ?? 0;
  }

  return {
    books: badiiy + darslik,
    badiiy,
    darslik,
    articles,
    tests,
    totalResources: resources.length,
    totalDownloads,
  };
}

function normalizeResources(list: Resource[]): Resource[] {
  const seedMap = new Map(SEED_RESOURCES.map((s) => [s.id, s.downloads]));
  return list.map((r) => ({
    ...r,
    downloads:
      typeof r.downloads === "number"
        ? r.downloads
        : (seedMap.get(r.id) ?? 0),
  }));
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
    const normalized = normalizeResources(parsed);
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return SEED_RESOURCES;
  }
}

export function saveResources(resources: Resource[]): void {
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
}

export function loadReadIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReadIds(readIds: string[]): void {
  localStorage.setItem(READ_IDS_KEY, JSON.stringify(readIds));
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
