"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/confirm-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DUMMY_GROUPS, type GroupCategory } from "@/lib/dummy-data";

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const group = DUMMY_GROUPS.find((g) => g.id === id);

  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [category, setCategory] = useState<GroupCategory | "">(
    group?.category ?? "",
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("그룹 설정 저장:", { name, description, category });
  }

  function handleDelete() {
    console.log("그룹 삭제:", id);
    router.push("/protected/groups");
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h2 className="text-lg font-semibold">그룹 설정</h2>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-base">그룹 정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">그룹 이름 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as GroupCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="golf">골프</SelectItem>
                  <SelectItem value="swimming">수영</SelectItem>
                  <SelectItem value="fitness">헬스</SelectItem>
                  <SelectItem value="social">친목</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button type="submit">저장</Button>
          </CardFooter>
        </form>
      </Card>

      <Separator />

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            위험 구역
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            그룹을 삭제하면 모든 이벤트, 투표, 멤버 데이터가 영구적으로
            삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            그룹 삭제
          </Button>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="그룹을 삭제하시겠습니까?"
        description="모든 이벤트, 투표, 멤버 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
