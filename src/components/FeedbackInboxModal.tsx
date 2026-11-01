import { Inbox, X } from "lucide-react";
import type { FeedbackSubmission } from "../types";

interface FeedbackInboxModalProps {
  open: boolean;
  onClose: () => void;
  submissions: FeedbackSubmission[];
}

export function FeedbackInboxModal({ open, onClose, submissions }: FeedbackInboxModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-label="Yopish" />
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Yopish"><X className="h-5 w-5" /></button>
        <div className="flex items-center gap-3 pr-8"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Inbox className="h-5 w-5" /></div><div><h2 className="text-xl font-bold text-slate-800">Kelgan fikrlar</h2><p className="text-sm text-slate-500">Sayt foydalanuvchilaridan yuborilgan xabarlar</p></div></div>
        {submissions.length === 0 ? <p className="py-12 text-center text-sm text-slate-500">Hozircha fikrlar kelmagan.</p> : <div className="mt-5 space-y-3">{submissions.map((submission) => <article key={submission.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-semibold text-slate-800">{submission.name}</h3><time className="text-xs text-slate-400">{new Date(submission.createdAt).toLocaleString("uz-UZ")}</time></div>{submission.contact && <p className="mt-1 text-xs text-emerald-700">Aloqa: {submission.contact}</p>}<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{submission.message}</p></article>)}</div>}
      </div>
    </div>
  );
}
