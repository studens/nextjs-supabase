import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DUMMY_POLL_VOTES, DUMMY_POLLS } from "@/lib/dummy-data";

export default async function GroupPollsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const polls = DUMMY_POLLS.filter((p) => p.group_id === id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">투표</h2>
        <Button size="sm" asChild>
          <Link href={`/protected/groups/${id}/polls/new`}>+ 새 투표</Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <EmptyState
          title="등록된 투표가 없습니다"
          description="새 투표를 만들어 멤버들의 의견을 모아보세요."
          action={
            <Button asChild>
              <Link href={`/protected/groups/${id}/polls/new`}>
                투표 만들기
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {polls.map((poll) => {
            const voteCount = DUMMY_POLL_VOTES.filter(
              (v) => v.poll_id === poll.id,
            ).length;

            const deadlineStr = poll.deadline
              ? new Date(poll.deadline).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "기한 없음";

            return (
              <Card key={poll.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{poll.title}</CardTitle>
                    <Badge variant={poll.is_closed ? "secondary" : "default"}>
                      {poll.is_closed ? "마감" : "진행중"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {poll.description}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    마감: {deadlineStr}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0">
                  <span className="text-xs text-muted-foreground">
                    총 {voteCount}표
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/protected/groups/${id}/polls/${poll.id}`}>
                      자세히 보기
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
