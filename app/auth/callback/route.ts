// Google OAuth PKCE 코드 교환 라우트 핸들러
// 구글 로그인 후 Supabase가 이 URL로 리다이렉트합니다.
// URL에 포함된 "code"를 세션 토큰으로 교환하는 역할을 합니다.

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Supabase가 리다이렉트 URL에 붙여준 인증 코드
  const code = searchParams.get("code");

  // 로그인 성공 후 이동할 페이지 (기본값: /protected)
  const next = searchParams.get("next") ?? "/protected";

  if (code) {
    const supabase = await createClient();

    // 인증 코드 → 세션 토큰 교환 (PKCE 방식)
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 성공: 원래 가려던 페이지로 이동
      redirect(next);
    } else {
      // 코드 교환 실패: 에러 페이지로 이동
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // code 파라미터가 없는 경우 (잘못된 접근)
  redirect(
    `/auth/error?error=${encodeURIComponent("No authorization code provided")}`,
  );
}
