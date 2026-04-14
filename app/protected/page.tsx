import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { type Profile } from "@/lib/database.types";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { Suspense } from "react";

async function UserProfile() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single<Profile>();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="font-medium text-muted-foreground">이름</span>
        <span>{profile?.full_name ?? "—"}</span>

        <span className="font-medium text-muted-foreground">이메일</span>
        <span>{profile?.email ?? authData.user.email ?? "—"}</span>

        <span className="font-medium text-muted-foreground">아바타</span>
        <span>{profile?.avatar_url ?? "—"}</span>

        <span className="font-medium text-muted-foreground">웹사이트</span>
        <span>{profile?.website ?? "—"}</span>

        <span className="font-medium text-muted-foreground">자기소개</span>
        <span>{profile?.bio ?? "—"}</span>

        <span className="font-medium text-muted-foreground">가입일</span>
        <span>
          {profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString("ko-KR")
            : "—"}
        </span>
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="w-full">
        <div className="flex items-center gap-3 rounded-md bg-accent p-3 px-5 text-sm text-foreground">
          <InfoIcon size="16" strokeWidth={2} />이 페이지는 로그인한 사용자만 볼
          수 있는 보호된 페이지입니다.
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <h2 className="mb-4 text-2xl font-bold">내 프로필</h2>
        <div className="w-full max-w-md rounded border p-4">
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            }
          >
            <UserProfile />
          </Suspense>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-bold">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
