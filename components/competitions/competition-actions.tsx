"use client";
import { Eye, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";
import { useLanguage } from "@/app/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CompetitionActions({
  competition,
}: {
  competition: { _id: Id<"tenders">; id: number; archived?: boolean };
}) {
  const { tr } = useLanguage();
  const router = useRouter();
  const open = () => router.push(`/dashboard/competitions/${competition.id}`); 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label={`${tr("إجراءات", "Actions")} ${competition._id}`}
          />
        }
      >
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuItem onClick={open}>
          <Eye className="me-2 h-4 w-4" />
          {tr("عرض التفاصيل", "View details")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
