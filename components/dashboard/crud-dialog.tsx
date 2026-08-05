"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

export const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";
export const labelClass = "grid gap-1.5 text-xs font-semibold text-slate-600";

export function CrudDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-indigo-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white bg-white p-6 shadow-2xl"><header className="mb-5 flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-indigo-950">{title}</h2><button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button></header>{children}</div></div>;
}

export function FormActions({ onCancel, busy, submitLabel }: { onCancel: () => void; busy: boolean; submitLabel: string }) {
  return <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button disabled={busy} className="rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : submitLabel}</button></div>;
}

export function ResourceActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="flex items-center gap-2"><button type="button" onClick={onEdit} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100">Edit</button><button type="button" onClick={onDelete} className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-bold text-rose-600 hover:bg-rose-100">Delete</button></div>;
}
