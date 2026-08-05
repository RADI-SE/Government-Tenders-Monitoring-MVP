"use client";
import { Eye, MoreHorizontal, Paperclip, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/app/components/language-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function CompetitionActions({ competition }: { competition: { _id: string } }) {
  const { tr } = useLanguage();
  const router = useRouter();
  const open = () => router.push(`/dashboard/competitions/${competition._id}`);
  return <DropdownMenu><DropdownMenuTrigger render={<Button size="icon" variant="ghost" aria-label={`${tr("إجراءات", "Actions")} ${competition._id}`} />}><MoreHorizontal className="h-5 w-5" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="min-w-56"><DropdownMenuItem onClick={open}><Eye className="me-2 h-4 w-4" />{tr("عرض التفاصيل", "View details")}</DropdownMenuItem><DropdownMenuItem onClick={open}><Sparkles className="me-2 h-4 w-4" />{tr("ملخص الذكاء الاصطناعي", "AI summary")}</DropdownMenuItem><DropdownMenuItem onClick={open}><Paperclip className="me-2 h-4 w-4" />{tr("المرفقات", "Attachments")}</DropdownMenuItem><DropdownMenuItem onClick={open}><Star className="me-2 h-4 w-4" />{tr("حفظ المنافسة", "Save")}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}
