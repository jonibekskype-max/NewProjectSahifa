import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, CheckCircle2, Library, SearchX } from "lucide-react";
import type { CategoryId, FeedbackSubmission, Resource, SortOption, User } from "./types";
import {
  computeResourceSummary,
  filterResources,
  incrementResourceDownloads,
  loadFeedback,
  loadReadIds,
  loadResources,
  loadUser,
  saveFeedback,
  saveReadIds,
  saveResources,
  saveUser,
  sortResources,
  toggleReadResource,
} from "./lib/storage";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { ResourceCard } from "./components/ResourceCard";
import { ResourceSummaryCard } from "./components/ResourceSummaryCard";
import { AddResourceModal } from "./components/AddResourceModal";
import { FeedbackInboxModal } from "./components/FeedbackInboxModal";
import { FeedbackModal } from "./components/FeedbackModal";

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [readIds, setReadIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);

  useEffect(() => {
    setResources(loadResources());
    setUser(loadUser());
    setFeedback(loadFeedback());
    setReadIds(loadReadIds());
  }, []);

  function persist(next: Resource[]) {
    setResources(next);
    saveResources(next);
  }

  function handleLogin(u: User) {
    setUser(u);
    saveUser(u);
    setLoginPromptOpen(false);
  }

  function handleLogout() {
    setUser(null);
    saveUser(null);
  }

  function handleAddClick() {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    setModalOpen(true);
  }

  function handleAdd(r: Omit<Resource, "id" | "createdAt" | "addedBy" | "downloads">) {
    if (!user) return;
    const newResource: Resource = {
      ...r,
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      addedBy: user.id,
      downloads: 0,
    };
    persist([newResource, ...resources]);
  }

  function handleDelete(id: string) {
    persist(resources.filter((r) => r.id !== id));
  }

  function handleDownload(id: string) {
    persist(incrementResourceDownloads(resources, id));
  }

  function handleToggleRead(id: string) {
    const next = toggleReadResource(readIds, id);
    setReadIds(next);
    saveReadIds(next);
  }

  function handleFeedbackSubmit(name: string, contact: string, message: string): void {
    const submission: FeedbackSubmission = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      contact,
      message,
      createdAt: Date.now(),
    };
    const nextFeedback = [submission, ...feedback];
    setFeedback(nextFeedback);
    saveFeedback(nextFeedback);
  }

  const filtered = useMemo(() => {
    const matched = filterResources(resources, query, activeCategory);
    return sortResources(matched, sortBy);
  }, [resources, query, activeCategory, sortBy]);

  const summary = useMemo(
    () => computeResourceSummary(resources),
    [resources]
  );

  const readCount = useMemo(
    () => resources.filter((r) => readIds.includes(r.id)).length,
    [resources, readIds]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAddClick={handleAddClick}
        onFeedbackClick={() => setFeedbackOpen(true)}
        onInboxClick={() => setInboxOpen(true)}
      />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/60 to-slate-50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Library className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
              O'zbek kitob va o'quv materiallari kutubxonasi
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Darsliklar, badiiy kitoblar, ilmiy maqolalar va testlar — bir joyda.
          </p>
        </div>
        <div className="mt-3.5">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Results */}
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <ResourceSummaryCard summary={summary} />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
              ta material topildi
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
              data-testid="personal-read-progress"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              O'qilgan: {readCount} / {resources.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user && (
              <p className="text-xs text-slate-400">
                Joriy foydalanuvchi:{" "}
                <span className="font-medium text-emerald-700">{user.name}</span>
              </p>
            )}
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span>Saralash:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Materiallarni saralash"
                data-testid="resource-sort-select"
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="newest">Sana bo'yicha (Eng yangilari)</option>
                <option value="popular">Ommabopligi bo'yicha (Ko'p yuklangan)</option>
              </select>
            </label>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                currentUser={user}
                isRead={readIds.includes(r.id)}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <SearchX className="mb-3 h-10 w-10 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700">
              Hech narsa topilmadi
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Boshqa kalit so'z bilan urinib ko'ring yoki kategoriyani o'zgartiring.
            </p>
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl text-center text-xs text-slate-400">
          BilimXazina — O'zbekiston o'quvchilari va talabalari uchun kutubxona. © {new Date().getFullYear()}
        </div>
      </footer>

      <AddResourceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <FeedbackInboxModal
        open={inboxOpen}
        onClose={() => setInboxOpen(false)}
        submissions={feedback}
      />

      {loginPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setLoginPromptOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800">
              Avval tizimga kiring
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Material qo'shish uchun hisobingizga kiring. Demo hisoblar: Sohibjon va Jonibek.
            </p>
            <div className="mt-4 flex gap-2.5">
              <button
                onClick={() => setLoginPromptOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Yopish
              </button>
              <button
                onClick={() => handleLogin({ id: "sohibjon", name: "Sohibjon" })}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Sohibjon sifatida kirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
