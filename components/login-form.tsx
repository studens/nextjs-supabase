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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 구글 로그인 전용 로딩 상태
  // 리다이렉트 중에는 false로 되돌리지 않아 버튼이 계속 비활성화 상태 유지
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  // 두 로딩 상태 중 하나라도 true면 모든 버튼 비활성화
  const isAnyLoading = isLoading || isGoogleLoading;

  // 이메일/비밀번호 로그인 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 OAuth 로그인 핸들러
  // signInWithOAuth는 구글 로그인 페이지로 리다이렉트하기 때문에
  // 성공 시 finally에서 setIsGoogleLoading(false)를 호출하지 않습니다.
  // 리다이렉트 중에도 버튼이 비활성화 상태를 유지해야 하기 때문입니다.
  const handleGoogleLogin = async () => {
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
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
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* 이메일 로그인 버튼 */}
              <Button type="submit" className="w-full" disabled={isAnyLoading}>
                {isLoading ? "Logging in..." : "Login"}
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

              {/* 구글 로그인 버튼 */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading}
              >
                <GoogleIcon />
                {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
