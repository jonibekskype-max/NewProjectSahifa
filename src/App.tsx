import { useEffect, useMemo, useState } from "react";
import { Library, SearchX } from "lucide-react";
import type { CategoryId, FeedbackSubmission, Resource, User } from "./types";
import {
  filterResources,
  loadResources,
  saveResources,
  loadUser,
  saveUser,
  loadFeedback,
  saveFeedback,
} from "./lib/storage";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { ResourceCard } from "./components/ResourceCard";
import { AddResourceModal } from "./components/AddResourceModal";
import { FeedbackInboxModal } from "./components/FeedbackInboxModal";
import { FeedbackModal } from "./components/FeedbackModal";

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);

  useEffect(() => {
    setResources(loadResources());
    setUser(loadUser());
    setFeedback(loadFeedback());
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

  function handleAdd(r: Omit<Resource, "id" | "createdAt" | "addedBy">) {
    if (!user) return;
    const newResource: Resource = {
      ...r,
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      addedBy: user.id,
    };
    persist([newResource, ...resources]);
  }

  function handleDelete(id: string) {
    persist(resources.filter((r) => r.id !== id));
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

  const filtered = useMemo(
    () => filterResources(resources, query, activeCategory),
    [resources, query, activeCategory]
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50/60 to-slate-50 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Library className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            O'zbek kitob va o'quv materiallari kutubxonasi
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Darsliklar, badiiy kitoblar, ilmiy maqolalar va testlar — bir joyda.
            Tez qidiring, yuklab oling va bilmingizni boyiting.
          </p>
        </div>
        <div className="mt-8">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Results */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
            ta material topildi
          </p>
          {user && (
            <p className="text-xs text-slate-400">
              Joriy foydalanuvchi: <span className="font-medium text-emerald-700">{user.name}</span>
            </p>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                currentUser={user}
                onDelete={handleDelete}
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
