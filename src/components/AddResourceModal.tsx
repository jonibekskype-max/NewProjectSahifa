import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CategoryId, Resource } from "../types";
import { CATEGORIES } from "../constants";

interface AddResourceModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (r: Omit<Resource, "id" | "createdAt" | "addedBy">) => void;
}

export function AddResourceModal({ open, onClose, onAdd }: AddResourceModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<CategoryId>("badiiy");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !link.trim()) {
      setError("Sarlavha, muallif va fayl havolasi majburiy maydonlardir.");
      return;
    }
    onAdd({
      title: title.trim(),
      author: author.trim(),
      category,
      link: link.trim(),
      description: description.trim() || "Tavsif kiritilmagan.",
    });
    setTitle("");
    setAuthor("");
    setCategory("badiiy");
    setLink("");
    setDescription("");
    setError("");
    onClose();
  }

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Yangi material qo'shish
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5">
          {error && (
            <div className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div>
            <label className={labelCls}>Sarlavha *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Kitob yoki material nomi"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Muallif / manba *</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Masalan: A. Qodiriy yoki Ta'lim vazirligi"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Kategoriya</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fayl havolasi (PDF link) *</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/kitob.pdf"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Qisqa tavsif</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Material haqida qisqacha ma'lumot..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
