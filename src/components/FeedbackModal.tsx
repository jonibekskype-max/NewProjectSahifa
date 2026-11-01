import { FormEvent, useState } from "react";
import { CheckCircle2, MessageSquare, Send, X } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, contact: string, message: string) => void;
}

export function FeedbackModal({ open, onClose, onSubmit }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(name.trim(), contact.trim(), message.trim());
    setSubmitted(true);
    setName("");
    setContact("");
    setMessage("");
  }

  function handleClose(): void {
    setSubmitted(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} aria-label="Yopish" />
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <button onClick={handleClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Yopish">
          <X className="h-5 w-5" />
        </button>
        {submitted ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-4 text-xl font-bold text-slate-800">Xabaringiz uchun rahmat!</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Shikoyatingiz adminlarga yuborildi.</p>
            <button onClick={handleClose} className="mt-6 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Yopish</button>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 pr-8">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><MessageSquare className="h-5 w-5" /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Fikr / Shikoyat</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">Fikringiz, taklifingiz yoki muammo haqida yozing.</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900">
              Xabaringiz to'g'ridan-to'g'ri sayt administratorlariga yuboriladi: <strong>@jonibeksamps</strong> (Jonibek) va <strong>@NorqulovSohibjon</strong> (Sohibjon).
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Ismingiz<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Ismingizni kiriting" /></label>
              <label className="block text-sm font-medium text-slate-700">Aloqa ma'lumoti <span className="font-normal text-slate-400">(ixtiyoriy)</span><input value={contact} onChange={(event) => setContact(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Telegram yoki telefon raqam" /></label>
              <label className="block text-sm font-medium text-slate-700">Xabaringiz<textarea required minLength={5} value={message} onChange={(event) => setMessage(event.target.value)} rows={5} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3.5 py-2.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Fikringiz yoki shikoyatingizni yozing..." /></label>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"><Send className="h-4 w-4" /> Yuborish</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
