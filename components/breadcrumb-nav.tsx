"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const segmentMap: Record<string, string> = {
  protected: "홈",
  groups: "내 그룹",
  events: "이벤트",
  polls: "투표",
  members: "멤버",
  settings: "설정",
  new: "새로 만들기",
  edit: "수정",
  attendance: "참여 현황",
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(segment: string) {
  return UUID_REGEX.test(segment);
}

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // UUID 세그먼트 제거 후 브레드크럼 아이템 구성
  const items: { label: string; href: string }[] = [];
  let cumulativePath = "";

  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    if (isUuid(segment)) continue;
    const label = segmentMap[segment] ?? segment;
    items.push({ label, href: cumulativePath });
  }

  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.href} className="flex items-center gap-1">
            {index > 0 && <span>/</span>}
            {isLast ? (
              <span className={cn("font-medium text-foreground")}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
