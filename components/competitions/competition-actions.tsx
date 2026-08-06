"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Archive, ArchiveRestore, Eye, LoaderCircle, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/app/components/language-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function CompetitionActions({ competition }: { competition: { _id: Id<"tenders">; id: number; archived?: boolean } }) {
  const { tr } = useLanguage();
  const router = useRouter();
  const archiveTender = useMutation(api.tenders.archiveTender);
  const restoreTender = useMutation(api.tenders.restoreTender);
  const [saving, setSaving] = useState(false);
  const open = () => router.push(`/dashboard/competitions/${competition.id}`);

  async function toggleArchive() {
    setSaving(true);
    try {
      if (competition.archived) await restoreTender({ tenderId: competition._id });
      else await archiveTender({ tenderId: competition._id });
    } finally { setSaving(false); }
  }

  return <DropdownMenu>
    <DropdownMenuTrigger render={<Button size="icon" variant="ghost" aria-label={`${tr("إجراءات", "Actions")} ${competition._id}`} />}><MoreHorizontal className="h-5 w-5" /></DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-56">
      <DropdownMenuItem onClick={open}><Eye className="me-2 h-4 w-4" />{tr("عرض التفاصيل", "View details")}</DropdownMenuItem>
      <DropdownMenuItem onClick={toggleArchive} disabled={saving}>
        {saving ? <LoaderCircle className="me-2 h-4 w-4 animate-spin" /> : competition.archived ? <ArchiveRestore className="me-2 h-4 w-4" /> : <Archive className="me-2 h-4 w-4" />}
        {competition.archived ? tr("استعادة المنافسة", "Restore competition") : tr("نقل إلى الأرشيف", "Move to archive")}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
