import { BookOpen, FileText, GraduationCap, ClipboardList, Download, ExternalLink, Trash2 } from "lucide-react";
import type { CategoryId, Resource, User } from "../types";

interface ResourceCardProps {
  resource: Resource;
  currentUser: User | null;
  onDelete: (id: string) => void;
}

const CATEGORY_META: Record<
  CategoryId,
  { label: string; icon: typeof BookOpen; color: string; bg: string; badge: string }
> = {
  badiiy: {
    label: "Badiiy kitoblar",
    icon: BookOpen,
    color: "text-amber-700",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
  },
  darslik: {
    label: "Darsliklar",
    icon: GraduationCap,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
  },
  maqola: {
    label: "Ilmiy maqola",
    icon: FileText,
    color: "text-sky-700",
    bg: "bg-sky-50",
    badge: "bg-sky-100 text-sky-700",
  },
  test: {
    label: "Test / qo'llanma",
    icon: ClipboardList,
    color: "text-rose-700",
    bg: "bg-rose-50",
    badge: "bg-rose-100 text-rose-700",
  },
};

export function ResourceCard({ resource, currentUser, onDelete }: ResourceCardProps) {
  const meta = CATEGORY_META[resource.category];
  const Icon = meta.icon;
  const canDelete = currentUser && currentUser.id === resource.addedBy;

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${meta.badge}`}>
          {meta.label}
        </span>
      </div>

      <h3 className="mt-3.5 text-base font-semibold leading-snug text-slate-800">
        {resource.title}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{resource.author}</p>
      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {resource.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
        >
          <Download className="h-4 w-4" />
          Yuklab olish
        </a>
        <div className="flex items-center gap-2">
          {canDelete && (
            <button
              onClick={() => onDelete(resource.id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
              aria-label="O'chirish"
              title="O'chirish"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="O'qish"
            title="Onlayn o'qish"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
