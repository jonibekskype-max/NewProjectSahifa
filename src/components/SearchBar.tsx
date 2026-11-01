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
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Kitob, darslik yoki maqola qidirish... (Fizika, Matematika, Adabiyot)"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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

      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => onCategoryChange("all")}
          className={`rounded-full px-3.5 py-1 text-xs font-medium transition sm:text-sm ${
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
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition sm:text-sm ${
              activeCategory === cat.id
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
        <span className="text-xs text-slate-400">Fanlar:</span>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => onQueryChange(s)}
            className="rounded-md bg-slate-100/80 px-2 py-0.5 text-xs text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
