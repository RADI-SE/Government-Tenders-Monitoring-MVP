import { TenderStatus } from "../dashboard/competitions/types";

interface CompetitionStatusProps {
  status: TenderStatus;
}

export function CompetitionStatus({
  status,
}: CompetitionStatusProps) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium">
      {status.name}
    </span>
  );
}