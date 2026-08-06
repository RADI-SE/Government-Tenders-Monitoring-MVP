"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { FolderOpen, Plus } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import {
  ResourceEmpty,
  ResourceGrid,
  ResourcePage,
} from "@/components/dashboard/resource-page";
import {
  CrudDialog,
  fieldClass,
  FormActions,
  labelClass,
  ResourceActions,
} from "@/components/dashboard/crud-dialog";
import { useLanguage } from "@/app/components/language-provider";

export default function CategoriesPage() {
  const { tr } = useLanguage();
  const categories = useQuery(api.categories.getAll, {});
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const removeCategory = useMutation(api.categories.remove);
  const [editing, setEditing] = useState<Doc<"categories"> | null | undefined>(
    undefined,
  );
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      if (editing)
        await updateCategory({
          id: editing._id,
          name: String(data.get("name")),
        });
      else
        await createCategory({
          externalCategoryId: Number(data.get("externalId")),
          name: String(data.get("name")),
        });
      setEditing(undefined);
    } finally {
      setBusy(false);
    }
  }
  async function remove(item: Doc<"categories">) {
    if (window.confirm(tr("حذف هذا التصنيف؟", "Delete this category?")))
      await removeCategory({ id: item._id });
  }

  return (
    <ResourcePage
      eyebrow="MASTER DATA"
      title="تصنيفات المنافسات"
      titleEn="Competition categories"
      subtitle="Categories available for organizing and filtering opportunities."
      subtitleAr="التصنيفات المستخدمة لتنظيم الفرص وتصفيتها."
      icon={FolderOpen}
    >
      <div className="flex justify-end">
        <button
          onClick={() => setEditing(null)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          {tr("إضافة تصنيف", "Add category")}
        </button>
      </div>
      <ResourceGrid>
        {categories?.map((category) => (
          <article
            key={category._id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <FolderOpen className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="text-sm text-slate-950">
                {category.name}
              </strong>
              <small className="mt-1 block font-mono text-slate-400">
                ID {category.externalCategoryId}
              </small>
            </div>
            <ResourceActions
              onEdit={() => setEditing(category)}
              onDelete={() => remove(category)}
            />
          </article>
        ))}
        {!categories?.length && (
          <ResourceEmpty
            loading={categories === undefined}
            label="No categories available yet."
            labelAr="لا توجد تصنيفات بعد."
          />
        )}
      </ResourceGrid>
      {editing !== undefined ? (
        <CrudDialog
          title={
            editing
              ? tr("تعديل التصنيف", "Edit category")
              : tr("إضافة تصنيف", "Add category")
          }
          onClose={() => setEditing(undefined)}
        >
          <form onSubmit={save} className="grid gap-4">
            {!editing ? (
              <label className={labelClass}>
                {tr("المعرف الخارجي", "External ID")}
                <input
                  className={fieldClass}
                  name="externalId"
                  type="number"
                  required
                />
              </label>
            ) : null}
            <label className={labelClass}>
              {tr("اسم التصنيف", "Category name")}
              <input
                className={fieldClass}
                name="name"
                defaultValue={editing?.name ?? ""}
                required
              />
            </label>
            <FormActions
              onCancel={() => setEditing(undefined)}
              busy={busy}
              submitLabel={tr("حفظ", "Save")}
            />
          </form>
        </CrudDialog>
      ) : null}
    </ResourcePage>
  );
}
