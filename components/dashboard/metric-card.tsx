import type { LucideIcon } from "lucide-react";

export function MetricCard({ title, subtitle, value, icon: Icon, tone }: { title: string; subtitle: string; value: number; icon: LucideIcon; tone: "indigo" | "emerald" | "amber" | "cyan" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span>
      <div><p className="text-xs font-semibold text-slate-500">{title}</p><strong className="mt-1 block text-2xl text-slate-950">{value}</strong><small className="text-[10px] text-slate-400">{subtitle}</small></div>
    </article>
  );
}
