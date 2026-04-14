"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  groupId: string;
};

export function GroupTabNav({ groupId }: Props) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "이벤트",
      href: `/protected/groups/${groupId}`,
      isActive:
        pathname === `/protected/groups/${groupId}` ||
        pathname.includes("/events"),
    },
    {
      label: "투표",
      href: `/protected/groups/${groupId}/polls`,
      isActive: pathname.includes("/polls"),
    },
    {
      label: "멤버",
      href: `/protected/groups/${groupId}/members`,
      isActive: pathname.endsWith("/members"),
    },
    {
      label: "설정",
      href: `/protected/groups/${groupId}/settings`,
      isActive: pathname.endsWith("/settings"),
    },
  ];

  return (
    <nav className="flex border-b border-b-foreground/10">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors hover:text-foreground",
            tab.isActive
              ? "border-b-2 border-foreground text-foreground"
              : "text-muted-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
