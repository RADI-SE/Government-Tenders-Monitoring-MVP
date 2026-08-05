"use client";

import { MoreHorizontal, Eye, Sparkles, Star, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CompetitionActionsProps {
  competition: {
    _id: string;
  };
}

export function CompetitionActions({
  competition,
}: CompetitionActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          عرض التفاصيل
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Sparkles className="mr-2 h-4 w-4" />
          ملخص بالذكاء الاصطناعي
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Paperclip className="mr-2 h-4 w-4" />
          المرفقات
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          حفظ المنافسة
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}