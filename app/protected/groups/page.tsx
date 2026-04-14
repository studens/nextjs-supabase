import Link from "next/link";
import { redirect } from "next/navigation";

import { CategoryBadge } from "@/components/category-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DUMMY_GROUPS } from "@/lib/dummy-data";
import { createClient } from "@/lib/supabase/server";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 그룹 목록</h1>
        <Button asChild>
          <Link href="/protected/groups/new">+ 새 그룹</Link>
        </Button>
      </div>

      {DUMMY_GROUPS.length === 0 ? (
        <EmptyState
          title="참여 중인 그룹이 없습니다"
          description="새 그룹을 만들거나 초대를 받아보세요."
          action={
            <Button asChild>
              <Link href="/protected/groups/new">그룹 만들기</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DUMMY_GROUPS.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">
                    {group.name}
                  </CardTitle>
                  <CategoryBadge category={group.category} />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {group.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">
                  멤버 {group.member_count ?? 0}명
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/protected/groups/${group.id}`}>상세 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
