import { Search, X } from "lucide-react";
import { CATEGORIES, SUBJECTS } from "../constants";
import type { CategoryId } from "../types";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  activeCategory: CategoryId | "all";
  onCategoryChange: (c: CategoryId | "all") => void;
}

export function SearchBar({
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
}: SearchBarProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Kitob, darslik yoki maqola qidirish... (Fizika, Matematika, Adabiyot)"
          className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Tozalash"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onCategoryChange("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Barchasi
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.id
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xs text-slate-400">Fanlar:</span>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => onQueryChange(s)}
            className="rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
