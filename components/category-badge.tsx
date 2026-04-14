import { Badge } from "@/components/ui/badge";
import { Flag, Waves, Dumbbell, Users, MoreHorizontal } from "lucide-react";
import type { GroupCategory } from "@/lib/dummy-data";

type CategoryBadgeProps = {
  category: GroupCategory;
};

const categoryConfig: Record<
  GroupCategory,
  { label: string; icon: React.ReactNode }
> = {
  golf: { label: "골프", icon: <Flag className="h-3 w-3" /> },
  swimming: { label: "수영", icon: <Waves className="h-3 w-3" /> },
  fitness: { label: "헬스", icon: <Dumbbell className="h-3 w-3" /> },
  social: { label: "친목", icon: <Users className="h-3 w-3" /> },
  other: { label: "기타", icon: <MoreHorizontal className="h-3 w-3" /> },
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const { label, icon } = categoryConfig[category];

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {icon}
      {label}
    </Badge>
  );
}
