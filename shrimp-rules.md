# Development Guidelines

## Project Overview

- **목적**: 소규모 정기 모임(골프/수영/헬스/친목) 관리 웹 MVP — 그룹, 이벤트, 투표, 멤버 초대, 이메일 알림
- **스택**: Next.js 15 App Router + Supabase + Tailwind CSS + shadcn/ui ("new-york")
- **현재 완료**: Task 001 (인증 시스템 — 이메일/비밀번호 + 구글 OAuth)
- **다음 작업**: Task 002 (라우트 구조 및 빈 페이지 생성) → `docs/ROADMAP.md` 참조

---

## Project Architecture

### 핵심 디렉토리 역할

| 경로                     | 역할                                           |
| ------------------------ | ---------------------------------------------- |
| `app/`                   | Next.js App Router 페이지/레이아웃             |
| `app/auth/`              | 인증 라우트 (로그인, 회원가입, OAuth 콜백 등)  |
| `app/protected/`         | 인증 필수 페이지 (레이아웃에서 공통 네비 제공) |
| `app/protected/groups/`  | 그룹 관련 페이지 (Task 002부터 추가)           |
| `components/ui/`         | shadcn/ui 컴포넌트 (직접 수정 가능)            |
| `components/`            | 앱 전용 컴포넌트 (auth-button, login-form 등)  |
| `lib/supabase/client.ts` | 브라우저용 Supabase 클라이언트                 |
| `lib/supabase/server.ts` | 서버용 Supabase 클라이언트                     |
| `lib/supabase/proxy.ts`  | 미들웨어 세션 갱신 로직                        |
| `lib/database.types.ts`  | Supabase 스키마 TypeScript 타입                |
| `lib/utils.ts`           | `cn()` 유틸, `hasEnvVars` 체크                 |
| `proxy.ts`               | Next.js 미들웨어 진입점 (`updateSession` 호출) |
| `docs/ROADMAP.md`        | 22개 태스크 개발 계획 — 작업 전 반드시 확인    |

---

## Supabase 클라이언트 규칙

### 클라이언트 선택 기준

- **Client Component** (`'use client'`): `lib/supabase/client.ts`의 `createBrowserClient` 사용
- **Server Component / Route Handler**: `lib/supabase/server.ts`의 `createClient()` 사용
- **미들웨어**: `lib/supabase/proxy.ts`의 `updateSession()` 사용

### 절대 규칙

- `createClient()` (서버용)를 전역 변수에 저장 금지 — 매 요청마다 새로 생성
- 서버 컴포넌트에서 `lib/supabase/client.ts` import 금지
- Client Component에서 `lib/supabase/server.ts` import 금지
- `createServerClient<Database>(...)` — 반드시 `Database` 제네릭 타입 전달

### 올바른 사용 패턴

```typescript
// Server Component에서 데이터 조회
const supabase = await createClient();
const { data } = await supabase.from("profiles").select("*").eq("id", userId);

// Client Component에서 인증 처리
const supabase = createClient(); // lib/supabase/client.ts
await supabase.auth.signInWithPassword({ email, password });
```

---

## Route & Auth Protection Pattern

### 라우트 분류

| 경로           | 인증 필요 | 미들웨어 처리                         |
| -------------- | --------- | ------------------------------------- |
| `/`            | X         | 공개                                  |
| `/auth/*`      | X         | 공개                                  |
| `/instruments` | X         | 공개 (예외 처리됨)                    |
| `/protected/*` | O         | 미들웨어가 `/auth/login`으로 리디렉션 |

### Protected 페이지 인증 확인 패턴

- 미들웨어만으로 보호하지 말고, **각 페이지에서 직접 인증 확인 후 redirect 처리**
- 반드시 `supabase.auth.getUser()`로 확인 (getClaims 아님)

```typescript
// 모든 protected 페이지에서 사용하는 표준 패턴
const supabase = await createClient();
const { data: authData, error: authError } = await supabase.auth.getUser();
if (authError || !authData?.user) {
  redirect("/auth/login");
}
```

### 미들웨어 공개 경로 추가 시

- `lib/supabase/proxy.ts`의 조건문 수정 (`/instruments` 경로 패턴 참고)
- 새 공개 경로 추가 시 `proxy.ts`의 `config.matcher`와 `lib/supabase/proxy.ts`의 조건문 **동시 수정**

---

## Component Rules

### Server vs Client Component 결정 기준

- **기본값**: Server Component (파일 최상단에 `'use client'` 없음)
- **Client Component 필요 조건**: `useState`, `useEffect`, `useRouter`, 이벤트 핸들러, Supabase 브라우저 클라이언트 사용 시

### 폼 컴포넌트 패턴 (Client Component)

```typescript
"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// useState로 상태 관리, 제출 시 createClient() 호출
```

### shadcn/ui 컴포넌트 추가

- `npx shadcn@latest add <component>` 명령 사용
- 추가된 컴포넌트는 `components/ui/`에 위치
- `components.json` 파일이 shadcn 설정 관리

---

## Database Type Management

### 새 테이블 추가 절차

1. `lib/database.types.ts`에 테이블 타입 추가 (Row, Insert, Update)
2. `Database` 타입의 `public.Tables`에 새 테이블 등록
3. 필요 시 별도 export 타입 추가 (예: `export type Profile = {...}`)

### 타입 추가 예시

```typescript
// lib/database.types.ts
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: ...; Update: ... };
      groups: { Row: Group; Insert: ...; Update: ... }; // 새 테이블 추가
    };
  };
};
```

### ROADMAP Task 008 기준 추가 테이블 목록

`groups`, `group_members`, `events`, `rsvp`, `polls`, `poll_options`, `poll_votes`, `invitations` — 8개 테이블 타입 `lib/database.types.ts`에 추가 필요

---

## Multi-File Coordination Rules

### 동시 수정이 필요한 파일 관계

| 변경 작업               | 수정해야 하는 모든 파일                  |
| ----------------------- | ---------------------------------------- |
| 새 DB 테이블 추가       | `lib/database.types.ts`                  |
| 새 공개 라우트 추가     | `lib/supabase/proxy.ts` (조건문)         |
| 새 shadcn 컴포넌트 설치 | `components/ui/<name>.tsx` (자동 생성됨) |
| 태스크 완료             | `docs/ROADMAP.md` (완료 표시로 변경)     |
| 환경 변수 추가          | `.env.local` + `.env.example` 동시 추가  |

---

## Code Style Rules

### Tailwind + className

- className 조합: 반드시 `cn()` 함수 사용 (`import { cn } from "@/lib/utils"`)
- 다크모드: `next-themes` + `class` 전략 (이미 설정됨)
- Tailwind 클래스 순서: Prettier + `prettier-plugin-tailwindcss`가 자동 정렬

### Import 경로

- 절대 경로 사용: `@/` 접두사 (`tsconfig.json`에 설정됨)
- 예시: `import { createClient } from "@/lib/supabase/server"`

### TypeScript

- 타입 추론 우선, 불필요한 `any` 금지
- 에러 처리: `catch (error: unknown)` + `error instanceof Error` 패턴

---

## Workflow Rules

### 작업 전 필수 확인

1. `docs/ROADMAP.md`에서 현재 작업 태스크 확인
2. 관련 기존 파일을 먼저 읽고 패턴 파악
3. 태스크 완료 후 `docs/ROADMAP.md` 완료 표시 업데이트

### Git Commit Convention

- 이모지 + 컨벤셔널 커밋 형식: `✨ feat: 기능 설명`
- 이모지 예시: `✨` feat, `🐛` fix, `📝` docs, `♻️` refactor, `🎨` style, `🏷️` types
- 커밋 메시지는 한국어 또는 영어 (기존 커밋 참고)

### 코드 품질 자동화 (수동 실행 불필요)

- **pre-commit**: lint-staged → 변경 파일 ESLint + Prettier 자동 적용
- **pre-push**: TypeScript 타입 체크 (`npm run type-check`)

---

## Prohibited Actions

- **절대 금지**: `createClient()` (서버용)를 전역 변수나 모듈 레벨에 저장
- **절대 금지**: Server Component에서 `'use client'` 없이 `useState`, `useEffect` 사용
- **절대 금지**: `lib/supabase/server.ts`를 Client Component에서 import
- **절대 금지**: `lib/supabase/client.ts`를 Server Component에서 import
- **절대 금지**: DB 타입 없이 `supabase.from("테이블명")` 사용 (`Database` 제네릭 필수)
- **금지**: 새 DB 테이블 Supabase에 추가 후 `lib/database.types.ts` 업데이트 누락
- **금지**: protected 라우트에서 미들웨어만 믿고 페이지 레벨 인증 확인 생략
- **금지**: `components/ui/` 외부에 shadcn 컴포넌트 직접 생성 (반드시 CLI로 설치)
- **금지**: `.env.local` 값을 코드에 하드코딩
- **금지**: `any` 타입 남용 — 특히 Supabase 쿼리 결과에 `as any` 캐스팅

---

## Page Creation Pattern (Protected Routes)

새 protected 페이지 추가 시 표준 구조:

```typescript
// app/protected/groups/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  if (error || !authData?.user) redirect("/auth/login");

  // 데이터 조회 및 렌더링
}
```

동적 라우트 세그먼트: `app/protected/groups/[id]/page.tsx` 형식 사용
