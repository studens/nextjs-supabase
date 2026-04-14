import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventStatus, RsvpStatus, MemberRole } from "@/lib/dummy-data";

type StatusBadgeProps =
  | { type: "event"; status: EventStatus }
  | { type: "rsvp"; status: RsvpStatus }
  | { type: "role"; status: MemberRole };

const eventConfig: Record<EventStatus, { label: string; className: string }> = {
  upcoming: {
    label: "예정",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  ongoing: {
    label: "진행중",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  completed: {
    label: "완료",
    className: "border-gray-200 bg-gray-50 text-gray-600",
  },
  cancelled: {
    label: "취소",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const rsvpConfig: Record<RsvpStatus, { label: string; className: string }> = {
  attending: {
    label: "참가",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  not_attending: {
    label: "불참",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  undecided: {
    label: "미정",
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
};

const roleConfig: Record<MemberRole, { label: string; className: string }> = {
  host: {
    label: "호스트",
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
  member: {
    label: "멤버",
    className: "border-gray-200 bg-gray-50 text-gray-600",
  },
};

export function StatusBadge({ type, status }: StatusBadgeProps) {
  let config: { label: string; className: string };

  if (type === "event") {
    config = eventConfig[status as EventStatus];
  } else if (type === "rsvp") {
    config = rsvpConfig[status as RsvpStatus];
  } else {
    config = roleConfig[status as MemberRole];
  }

  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}
