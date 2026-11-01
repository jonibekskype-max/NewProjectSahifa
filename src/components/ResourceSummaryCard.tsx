import { BarChart3, BookOpen, ClipboardList, Download, FileText } from "lucide-react";
import type { ResourceSummary } from "../types";

interface ResourceSummaryCardProps {
  summary: ResourceSummary;
}

export function ResourceSummaryCard({ summary }: ResourceSummaryCardProps) {
  const maxVal = Math.max(summary.books, summary.articles, summary.tests, 1);

  const bars = [
    {
      id: "books",
      label: "Kitoblar (Books)",
      sublabel: `${summary.badiiy} badiiy · ${summary.darslik} darslik`,
      count: summary.books,
      icon: BookOpen,
      barColor: "bg-emerald-600",
      softBg: "bg-emerald-50/70",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200/80",
    },
    {
      id: "articles",
      label: "Maqolalar (Articles)",
      sublabel: "Ilmiy maqolalar",
      count: summary.articles,
      icon: FileText,
      barColor: "bg-sky-600",
      softBg: "bg-sky-50/70",
      textColor: "text-sky-700",
      borderColor: "border-sky-200/80",
    },
    {
      id: "tests",
      label: "Testlar (Tests)",
      sublabel: "Test va qo'llanmalar",
      count: summary.tests,
      icon: ClipboardList,
      barColor: "bg-rose-600",
      softBg: "bg-rose-50/70",
      textColor: "text-rose-700",
      borderColor: "border-rose-200/80",
    },
  ];

  return (
    <section
      aria-label="Kutubxona statistikasi"
      data-testid="resource-summary-card"
      className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 sm:text-base">
              Materiallar umumiy ko'rsatkichi
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs">
            <span className="text-slate-500">Jami fond:</span>
            <span className="font-bold text-slate-800">
              {summary.totalResources} ta
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200/70 bg-emerald-50/70 px-2.5 py-1 text-xs">
            <Download className="h-3 w-3 text-emerald-700" />
            <span className="text-emerald-700">Yuklashlar:</span>
            <span
              className="font-bold text-emerald-800"
              data-testid="total-downloads-count"
            >
              {summary.totalDownloads}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center">
        {/* Compact Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 lg:col-span-7">
          {bars.map((item) => {
            const Icon = item.icon;
            const pct =
              summary.totalResources > 0
                ? Math.round((item.count / summary.totalResources) * 100)
                : 0;
            return (
              <div
                key={item.id}
                data-testid={`summary-stat-${item.id}`}
                className={`rounded-lg border ${item.borderColor} ${item.softBg} px-3 py-2.5`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-2xs ${item.textColor}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-lg font-bold leading-none text-slate-800">
                      {item.count}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold ${item.textColor}`}>
                    {pct}%
                  </span>
                </div>
                <p className="mt-1.5 truncate text-xs font-semibold text-slate-700">
                  {item.label}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {item.sublabel}
                </p>
              </div>
            );
          })}
        </div>

        {/* Compact Bar Chart */}
        <div
          className="rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 lg:col-span-5"
          data-testid="summary-bar-chart"
        >
          <div className="space-y-2">
            {bars.map((item) => {
              const widthPercent = Math.max(
                Math.round((item.count / maxVal) * 100),
                6
              );
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600">
                      {item.label}
                    </span>
                    <span className="font-bold text-slate-800">
                      {item.count} ta
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                    <div
                      className={`h-full rounded-full ${item.barColor} transition-all duration-300`}
                      style={{ width: `${widthPercent}%` }}
                      role="progressbar"
                      aria-label={item.label}
                      aria-valuenow={item.count}
                      aria-valuemin={0}
                      aria-valuemax={summary.totalResources}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
