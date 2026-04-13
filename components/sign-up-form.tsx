"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/icons/google-icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 구글 회원가입 전용 로딩 상태
  // Supabase가 구글 신규 사용자를 자동으로 생성하므로
  // 로그인과 완전히 동일한 signInWithOAuth 로직 사용
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  // 두 로딩 상태 중 하나라도 true면 모든 버튼 비활성화
  const isAnyLoading = isLoading || isGoogleLoading;

  // 이메일/비밀번호 회원가입 핸들러
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 OAuth 회원가입 핸들러
  // 이미 구글 계정이 있으면 로그인, 없으면 자동으로 신규 계정 생성
  // 리다이렉트 중 버튼 비활성화 유지를 위해 성공 시 finally 호출 생략
  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // 구글 인증 완료 후 돌아올 URL (PKCE 코드를 처리하는 라우트)
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // 성공 시 구글 페이지로 리다이렉트됨 → isGoogleLoading은 true 유지
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      // 에러가 발생한 경우에만 로딩 상태 해제
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* 이메일 회원가입 버튼 */}
              <Button type="submit" className="w-full" disabled={isAnyLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* 구글 회원가입 버튼 */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={isAnyLoading}
              >
                <GoogleIcon />
                {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
