import type { Tender } from "../types";
const rawTenders =[
  {
    "id": 999001,
    "reference_number": "MOCK-001-2026",
    "tender_number": "MOCK/01/2026",
    "tender_name": "توريد وتركيب أنظمة مراقبة أمنية لمبنى الإدارة",
    "purpose": "توريد وتركيب كاميرات مراقبة وأنظمة إنذار حريق لمبنى الإدارة الرئيسي",
    "description": "توريد وتركيب كاميرات مراقبة وأنظمة إنذار حريق لمبنى الإدارة الرئيسي",
    "status": "معتمدة",
    "tender_type": "منافسة عامة",
    "document_cost": "500.00",
    "contract_duration": "24 شهر",
    "insurance_required": "لا",
    "submission_method": "ملفين منفصلين (فني ومالي)",
    "initial_guarantee_required": "لا يوجد ضمان",
    "final_guarantee": null,
    "classification_field": "تقنية المعلومات",
    "includes_supply_items": "نعم",
    "package_name": "نظام المراقبة الأمنية",
    "local_content_baseline": 30,
    "local_content_target": 50,
    "last_submission_date": "2026-09-15T12:59:00+03:00",
    "created_at": "2026-08-01T10:00:00+03:00",
    "updated_at": "2026-08-02T08:30:00+03:00",
    "agency": {
      "id": 1080,
      "name": "دارة الملك عبدالعزيز"
    },
    "execution_locations": [
      {
        "id": 999001,
        "region": { "id": 23, "name": "منطقة الرياض" },
        "city": { "id": 488, "name": "الرياض", "region": 23 }
      }
    ],
    "tender_activities": [
      {
        "id": 999001,
        "activity": { "id": 108, "name": "تقنية المعلومات" }
      }
    ],
    "construction_works": [],
    "maintenance_works": [],
    "beneficiary_entities": [],
    "suppliers": [],
    "awarded_suppliers": [],
    "local_content_mechanisms": [
      { "id": 999001, "name": "تفضيل المنشآت الصغيرة والمتوسطة" }
    ],
    "attachments": [
      {
        "id": 999001,
        "title": "وثائق المنافسة",
        "url": "https://example.com/mock-doc.pdf"
      }
    ],
    "analytics": null,
    "etimad_id": "MOCKETIMAD001",
    "time_remaining": "42 يوم",
    "opening_date": null,
    "check_date": "2026-09-16T13:00:00+03:00",
    "stopping_period": null,
    "expected_award_date": "2026-09-30T03:00:00+03:00",
    "work_start_date": "2026-10-01T03:00:00+03:00",
    "enquiry_start_date": "2026-08-01T03:00:00+03:00",
    "last_enquiry_date": "2026-09-05T03:00:00+03:00",
    "max_enquiry_response_time": "5",
    "receiving_inquiries_days": null,
    "receiving_offers_days": null,
    "opening_location": "الرياض",
    "awarding_number": null,
    "awarding_status": "لم يتم الترسية بعد",
    "agreement_type": null,
    "agreement_duration": null,
    "location_details": ""
  },
  {
    "id": 999002,
    "reference_number": "MOCK-002-2026",
    "tender_number": "MOCK/02/2026",
    "tender_name": "صيانة وتشغيل شبكات الصرف الصحي في المدينة الصناعية",
    "purpose": "تقديم خدمات الصيانة والتشغيل لشبكات الصرف الصحي بالمدينة الصناعية لمدة 3 سنوات",
    "description": "تقديم خدمات الصيانة والتشغيل لشبكات الصرف الصحي بالمدينة الصناعية لمدة 3 سنوات",
    "status": "مرحلة فتح العروض",
    "tender_type": "منافسة عامة",
    "document_cost": "1000.00",
    "contract_duration": "36 شهر",
    "insurance_required": "نعم",
    "submission_method": "ملف واحد للعرض الفني والمالي معا",
    "initial_guarantee_required": "200,000 ريال",
    "final_guarantee": "5% من قيمة العقد",
    "classification_field": "قطاع التشييد والبناء",
    "includes_supply_items": "لا",
    "package_name": null,
    "local_content_baseline": 40,
    "local_content_target": 60,
    "last_submission_date": "2026-09-10T12:59:00+03:00",
    "created_at": "2026-08-01T10:00:00+03:00",
    "updated_at": "2026-08-03T09:00:00+03:00",
    "agency": {
      "id": 745,
      "name": "الهيئة السعودية للمياه"
    },
    "execution_locations": [
      {
        "id": 999002,
        "region": { "id": 25, "name": "المنطقة الشرقية" },
        "city": { "id": 495, "name": "الدمام", "region": 25 }
      }
    ],
    "tender_activities": [
      {
        "id": 999002,
        "activity": { "id": 183, "name": "خدمات صيانة واصلاح المنتجات المعدنية والحاويات والصهاريج" }
      }
    ],
    "construction_works": [],
    "maintenance_works": [
      { "id": 999002, "name": "صيانة وتشغيل أعمال المياه والصرف الصحي" }
    ],
    "beneficiary_entities": [],
    "suppliers": [],
    "awarded_suppliers": [],
    "local_content_mechanisms": [
      { "id": 999002, "name": "القائمة الإلزامية" }
    ],
    "attachments": [],
    "analytics": null,
    "etimad_id": "MOCKETIMAD002",
    "time_remaining": "37 يوم",
    "opening_date": null,
    "check_date": "2026-09-11T13:00:00+03:00",
    "stopping_period": null,
    "expected_award_date": "2026-09-25T03:00:00+03:00",
    "work_start_date": "2026-10-01T03:00:00+03:00",
    "enquiry_start_date": "2026-08-01T03:00:00+03:00",
    "last_enquiry_date": "2026-08-30T03:00:00+03:00",
    "max_enquiry_response_time": "7",
    "receiving_inquiries_days": null,
    "receiving_offers_days": null,
    "opening_location": "الدمام",
    "awarding_number": null,
    "awarding_status": "لم يتم الترسية بعد",
    "agreement_type": null,
    "agreement_duration": null,
    "location_details": ""
  },
];

export const initialTenders: Tender[] = rawTenders.map((tender) => ({
  id: String(tender.id),
  reference: tender.reference_number,
  title: tender.tender_name,
  agency: tender.agency.name,
  category: tender.classification_field,
  region: tender.execution_locations[0]?.region.name ?? "غير محدد",
  publishDate: tender.created_at,
  deadline: tender.last_submission_date,
  status: "new",
  score: 70,
  value: tender.document_cost,
  purpose: tender.purpose,
  requirements: [tender.submission_method, tender.contract_duration],
  summary: tender.description,
  recommendation: "تحتاج المنافسة إلى مراجعة الفريق.",
  documents: tender.attachments.map((attachment) => ({
    name: attachment.title,
    size: "—",
  })),
}));

export const statusLabels = {
  new: "جديدة",
  reviewing: "قيد المراجعة",
  interested: "مهتمون",
  "not-suitable": "غير مناسبة",
  submitted: "تم التقديم",
  archived: "مؤرشفة",
} as const;
