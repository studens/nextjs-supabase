# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # 개발 서버 실행 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 전체 포맷
npm run format:check # Prettier 포맷 검사 (CI용)
npm run type-check   # TypeScript 타입 검사 (빌드 없이)
```

환경 변수 설정 (`.env.local` 파일 필요):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

### Git Hooks (자동 실행)

- **pre-commit**: lint-staged → 변경된 파일만 ESLint + Prettier 자동 적용
- **pre-push**: `type-check` → 전체 TypeScript 타입 검사

### 코드 품질 도구

- **ESLint**: `next/core-web-vitals` + `next/typescript` + `prettier` (충돌 방지)
- **Prettier**: 큰따옴표, 세미콜론, trailing comma all 설정. `prettier-plugin-tailwindcss`로 Tailwind 클래스 순서 자동 정렬

## Architecture

**Next.js 15 App Router** 기반 프로젝트로, Supabase 인증과 데이터베이스를 사용한다.

### Supabase 클라이언트 패턴

두 가지 Supabase 클라이언트가 존재하며 용도가 다르다:

- `lib/supabase/client.ts` — 브라우저용 (`createBrowserClient`). Client Component에서만 사용.
- `lib/supabase/server.ts` — 서버용 (`createServerClient`). Server Component, Route Handler에서 사용. 매 요청마다 새로 생성해야 하며 전역 변수로 쓰면 안 됨.

세션 관리는 루트의 `proxy.ts` (Next.js 미들웨어 진입점) → `lib/supabase/proxy.ts` (`updateSession`) 구조로 동작한다. 매 요청마다 `supabase.auth.getClaims()`로 쿠키 기반 세션을 갱신하고, 인증되지 않은 사용자를 `/auth/login`으로 리디렉션한다 (`/`, `/auth/*`, `/instruments` 경로 제외).

### 라우트 구조

- `/` — 공개 홈페이지 (튜토리얼 온보딩)
- `/auth/*` — 로그인, 회원가입, 비밀번호 찾기/변경, OAuth 콜백
- `/protected/*` — 인증 필수 페이지 (레이아웃에서 공통 네비 제공, 개별 페이지에서 `createClient()`로 인증 확인 후 redirect)
- `/instruments` — Supabase DB 조회 예제 (인증 불필요)

### 컴포넌트 규칙

- 기본적으로 모든 컴포넌트는 **Server Component**
- 상태/이벤트 처리가 필요할 때만 `'use client'` 추가
- `components/ui/` — shadcn/ui 컴포넌트 (직접 수정 가능)
- `components/` 루트 — 앱 전용 컴포넌트

### 데이터베이스 타입

`lib/database.types.ts`에 Supabase 스키마 타입 정의. `profiles` 테이블: `id, email, full_name, avatar_url, website, bio, created_at, updated_at`.

`createServerClient<Database>()`처럼 제네릭으로 타입을 넘겨야 `supabase.from("profiles")`에서 타입 추론이 동작한다. 새 테이블 추가 시 `Database` 타입에도 추가해야 함.

### 스타일링

- Tailwind CSS + shadcn/ui ("new-york" 스타일)
- CSS 변수(HSL)로 색상 정의, `globals.css`에서 관리
- 다크모드: `next-themes` (class 전략)
- className 조합: `cn()` 함수 사용 (`lib/utils.ts`)

## Docs

`docs/guides/` 에 한국어 가이드 있음:

- `nextjs-15.md` — Next.js 15 사용 패턴 및 금지 사항
- `component-patterns.md` — 컴포넌트 설계 패턴
- `project-structure.md` — 폴더/파일 구조 규칙
- `styling-guide.md`, `forms-react-hook-form.md`
