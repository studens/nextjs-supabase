import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void (await params);

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">그룹 홈</h1>
      <p className="text-muted-foreground">준비 중</p>
    </div>
  );
}
