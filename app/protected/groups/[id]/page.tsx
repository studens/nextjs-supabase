import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DUMMY_EVENTS, DUMMY_RSVP } from "@/lib/dummy-data";

export default async function GroupHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const events = DUMMY_EVENTS.filter((e) => e.group_id === id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">이벤트</h2>
        <Button size="sm" asChild>
          <Link href={`/protected/groups/${id}/events/new`}>+ 새 이벤트</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="등록된 이벤트가 없습니다"
          description="새 이벤트를 만들어 멤버들과 일정을 공유해보세요."
          action={
            <Button asChild>
              <Link href={`/protected/groups/${id}/events/new`}>
                이벤트 만들기
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => {
            const rsvps = DUMMY_RSVP.filter((r) => r.event_id === event.id);
            const attending = rsvps.filter(
              (r) => r.status === "attending",
            ).length;
            const notAttending = rsvps.filter(
              (r) => r.status === "not_attending",
            ).length;
            const undecided = rsvps.filter(
              (r) => r.status === "undecided",
            ).length;

            const dateStr = new Date(event.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            });

            return (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <StatusBadge type="event" status={event.status} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 pb-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0">
                  <span className="text-xs text-muted-foreground">
                    참가 {attending} · 불참 {notAttending} · 미정 {undecided}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/protected/groups/${id}/events/${event.id}`}>
                      상세 보기
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
