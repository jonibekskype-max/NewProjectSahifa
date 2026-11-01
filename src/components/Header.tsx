import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, MessageSquare, UserCheck } from "lucide-react";
import type { User } from "../types";
import { MOCK_USERS } from "../constants";
import { SahifaLogo } from "./SahifaLogo";

interface HeaderProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onAddClick: () => void;
  onFeedbackClick: () => void;
  onInboxClick: () => void;
}

export function Header({ user, onLogin, onLogout, onAddClick, onFeedbackClick, onInboxClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a
          href="/"
          aria-label="Sahifa bosh sahifasi"
          className="group -ml-6 px-6 py-4"
        >
          <SahifaLogo />
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={onFeedbackClick}
            className="hidden items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100 sm:flex"
          >
            <MessageSquare className="h-4 w-4" /> Feedback / Shikoyat
          </button>
          <button
            onClick={onAddClick}
            className="hidden items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 sm:flex"
          >
            <span className="text-lg leading-none">+</span> Material qo'shish
          </button>
          <button
            onClick={onFeedbackClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 sm:hidden"
            aria-label="Feedback yoki shikoyat yuborish"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={onAddClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 sm:hidden"
            aria-label="Material qo'shish"
          >
            <span className="text-xl leading-none">+</span>
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Tizimda: {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onInboxClick();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                  >
                    <MessageSquare className="h-4 w-4" /> Kelgan fikrlar
                  </button>
                  <div className="px-3 py-2">
                    <p className="mb-1.5 text-xs font-medium text-slate-400">
                      Hisobni almashtirish:
                    </p>
                    <div className="space-y-1">
                      {MOCK_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onLogin(u);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition hover:bg-slate-50 ${
                            u.id === user.id
                              ? "font-medium text-emerald-700"
                              : "text-slate-600"
                          }`}
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                            {u.name.charAt(0)}
                          </div>
                          {u.name}
                          {u.id === user.id && (
                            <UserCheck className="ml-auto h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span className="hidden sm:inline">Kirish</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  <p className="px-3 py-2 text-xs font-medium text-slate-400">
                    Hisobni tanlang:
                  </p>
                  {MOCK_USERS.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onLogin(u);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
