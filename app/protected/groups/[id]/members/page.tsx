"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Mail } from "lucide-react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DUMMY_INVITATIONS,
  DUMMY_MEMBERS,
  type GroupMember,
} from "@/lib/dummy-data";

function getInitials(member: GroupMember) {
  if (member.full_name) return member.full_name.slice(0, 1);
  return member.email.slice(0, 1).toUpperCase();
}

function getDisplayName(member: GroupMember) {
  return member.full_name ?? member.email;
}

export default function MembersPage() {
  const params = useParams();
  const id = params.id as string;

  const members = DUMMY_MEMBERS.filter((m) => m.group_id === id);
  const pendingInvitations = DUMMY_INVITATIONS.filter(
    (inv) => inv.group_id === id && inv.status === "pending",
  );

  const [inviteEmail, setInviteEmail] = useState("");
  const [removingMember, setRemovingMember] = useState<GroupMember | null>(
    null,
  );
  const [cancelingInviteId, setCancelingInviteId] = useState<string | null>(
    null,
  );

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("멤버 초대:", inviteEmail);
    setInviteEmail("");
  }

  function handleRemoveMember() {
    console.log("멤버 내보내기:", removingMember?.user_id);
    setRemovingMember(null);
  }

  function handleCancelInvite() {
    console.log("초대 취소:", cancelingInviteId);
    setCancelingInviteId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">멤버 관리</h2>
        <span className="text-sm text-muted-foreground">
          총 {members.length}명
        </span>
      </div>

      {/* 멤버 목록 - 데스크탑 테이블 */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>멤버</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {getDisplayName(member)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="role" status={member.role} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.joined_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    {member.role !== "host" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setRemovingMember(member)}
                      >
                        내보내기
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* 멤버 목록 - 모바일 카드 */}
      <div className="flex flex-col gap-3 md:hidden">
        {members.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-sm">
                      {getInitials(member)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {getDisplayName(member)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </div>
                <StatusBadge type="role" status={member.role} />
              </div>
            </CardHeader>
            <CardFooter className="flex items-center justify-between pt-0">
              <span className="text-xs text-muted-foreground">
                가입일: {new Date(member.joined_at).toLocaleDateString("ko-KR")}
              </span>
              {member.role !== "host" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setRemovingMember(member)}
                >
                  내보내기
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Separator />

      {/* 초대 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">멤버 초대</CardTitle>
        </CardHeader>
        <form onSubmit={handleInviteSubmit}>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">이메일 주소</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="초대할 이메일을 입력하세요"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
                <Button type="submit">초대 보내기</Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

      {/* 초대 대기 목록 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">초대 대기 중</h3>
        {pendingInvitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            대기 중인 초대가 없습니다.
          </p>
        ) : (
          pendingInvitations.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{inv.email}</span>
                    <span className="text-xs text-muted-foreground">
                      초대일:{" "}
                      {new Date(inv.invited_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">대기 중</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setCancelingInviteId(inv.id)}
                  >
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 멤버 내보내기 다이얼로그 */}
      <ConfirmDialog
        open={removingMember !== null}
        onOpenChange={(open) => !open && setRemovingMember(null)}
        title="멤버를 내보내시겠습니까?"
        description={`${getDisplayName(removingMember ?? ({ full_name: null, email: "" } as GroupMember))} 님을 그룹에서 내보냅니다.`}
        confirmLabel="내보내기"
        variant="destructive"
        onConfirm={handleRemoveMember}
      />

      {/* 초대 취소 다이얼로그 */}
      <ConfirmDialog
        open={cancelingInviteId !== null}
        onOpenChange={(open) => !open && setCancelingInviteId(null)}
        title="초대를 취소하시겠습니까?"
        description="이 초대를 취소하면 해당 이메일로 발송된 초대 링크가 무효화됩니다."
        confirmLabel="초대 취소"
        variant="destructive"
        onConfirm={handleCancelInvite}
      />
    </div>
  );
}
