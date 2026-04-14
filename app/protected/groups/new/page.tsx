"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GroupCategory } from "@/lib/dummy-data";

export default function NewGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GroupCategory | "">("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("그룹 생성:", { name, description, category });
    router.push("/protected/groups");
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          href="/protected/groups"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />내 그룹 목록
        </Link>
      </div>

      <h1 className="text-2xl font-bold">새 그룹 만들기</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-base">그룹 정보</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">그룹 이름 *</Label>
              <Input
                id="name"
                placeholder="예: 주말 골프 모임"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="그룹에 대해 간단히 소개해주세요."
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
                required
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
            <Button type="submit">그룹 만들기</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
