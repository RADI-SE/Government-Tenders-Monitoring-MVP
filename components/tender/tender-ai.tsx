"use client";

import {
  Clock,
  Target,
  Shield,
  TrendingUp,
  Building2,
  FileCheck,
} from "lucide-react";
import {
  AIAnalysisView,
  AIInsight,
  AIRecommendation,
  AIRisk,
} from "./ai-analysis-view";

interface TenderAIProps {
  tender: any;
}

export function TenderAI({ tender }: TenderAIProps) {
  const raw = tender?.raw_data;

  const sector = raw?.classification_field || "غير محدد";
  const daysRemaining = raw?.time_remaining || "غير محدد";
  const tenderType = raw?.tender_type || "غير محدد";
  const contractDuration = raw?.contract_duration || "غير محدد";
  const hasInsurance =
    raw?.insurance_required === "نعم" ? "مطلوب" : "غير مطلوب";
  const hasGuarantee = raw?.initial_guarantee_required ? "مطلوب" : "غير مطلوب";

  const insights: AIInsight[] = [
    {
      icon: <Target className="h-5 w-5 text-indigo-600" />,
      label: "القطاع",
      value: sector,
      color: "bg-indigo-50",
    },
    {
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      label: "الوقت المتبقي",
      value: daysRemaining,
      color: "bg-amber-50",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      label: "نوع المنافسة",
      value: tenderType,
      color: "bg-green-50",
    },
    {
      icon: <Building2 className="h-5 w-5 text-purple-600" />,
      label: "مدة العقد",
      value: contractDuration,
      color: "bg-purple-50",
    },
    {
      icon: <Shield className="h-5 w-5 text-red-600" />,
      label: "التأمين",
      value: hasInsurance,
      color: "bg-red-50",
    },
    {
      icon: <FileCheck className="h-5 w-5 text-blue-600" />,
      label: "الضمان الابتدائي",
      value: hasGuarantee,
      color: "bg-blue-50",
    },
  ];

  const recommendations: AIRecommendation[] = [
    ...(sector !== "غير محدد"
      ? [
          {
            text: `هذه المنافسة في قطاع "${sector}"، يُنصح بالاطلاع على المنافسات المماثلة في نفس القطاع.`,
            color: "indigo" as const,
          },
        ]
      : []),
    ...(daysRemaining !== "غير محدد"
      ? [
          {
            text: `الوقت المتبقي ${daysRemaining} – يوصى بتجهيز العرض في أقرب وقت.`,
            color: "amber" as const,
          },
        ]
      : []),
    ...(tenderType === "منافسة عامة"
      ? [
          {
            text: "منافسة عامة – توقع منافسة عالية، ركّز على التميز الفني.",
            color: "green" as const,
          },
        ]
      : []),
    ...(hasGuarantee === "مطلوب"
      ? [
          {
            text: "يتطلب ضمان ابتدائي – تأكد من توفر الضمان قبل التقديم.",
            color: "purple" as const,
          },
        ]
      : []),
  ];

  const risks: AIRisk[] = [
    {
      title: "مخاطر عالية",
      type: "high",
      items: [
        contractDuration !== "غير محدد" && contractDuration.includes("شهر")
          ? `مدة العقد قصيرة (${contractDuration}) قد تؤثر على الجدولة`
          : "مدة العقد غير واضحة",
        ...(hasInsurance !== "مطلوب"
          ? ["عدم وجود تأمين قد يزيد من المسؤولية"]
          : []),
      ].filter(Boolean) as string[],
    },
    {
      title: "مخاطر منخفضة",
      type: "low",
      items: [
        ...(tenderType === "منافسة عامة" ? ["منافسة عامة – فرص متكافئة"] : []),
        ...(hasGuarantee !== "مطلوب"
          ? ["لا يتطلب ضمان – تقليل التكاليف الأولية"]
          : []),
      ].filter(Boolean) as string[],
    },
  ];

  return (
    <AIAnalysisView
      title="تحليل الذكاء الاصطناعي"
      insights={insights}
      recommendations={recommendations}
      risks={risks}
    />
  );
}
