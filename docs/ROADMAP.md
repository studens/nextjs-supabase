# 모임 이벤트 관리 웹 MVP - 개발 로드맵

소규모 정기 모임(골프/수영/헬스/친목 등)의 공지, 참여 확인, 투표를 한 곳에서 관리하는 웹 애플리케이션

## 개요

이 프로젝트는 카카오톡 단톡방으로 처리하던 모임 운영을 체계적으로 관리할 수 있는 웹 서비스입니다. 주최자(Host)와 멤버(Member) 역할을 기반으로 다음 기능을 제공합니다:

- **그룹 관리**: 모임 생성, 멤버 초대, 역할 기반 권한 제어
- **이벤트 관리**: 이벤트 생성/수정/취소, 공지 열람, RSVP 참여 응답
- **투표 시스템**: 투표 생성/참여/결과 확인, 단일/복수 선택 지원
- **알림**: 이벤트/투표 생성 시 멤버 이메일 알림 발송

**기술 스택**: Next.js 15 App Router + Supabase + Tailwind CSS + shadcn/ui
**대상 사용자**: 모임당 10~50명 규모의 주최자(Host) 및 멤버(Member)

## 전체 진행률

- **Phase 1 - 애플리케이션 골격 구축**: 2/3 완료
- **Phase 2 - UI/UX 완성 (더미 데이터)**: 0/4 완료
- **Phase 3 - 데이터베이스 & Supabase 설정**: 0/2 완료
- **Phase 4 - 핵심 기능 API 연동 (Core)**: 0/5 완료
- **Phase 5 - 참여 기능 구현 (Engagement)**: 0/5 완료
- **Phase 6 - 고급 기능 및 최적화**: 0/3 완료
- **총 진행률**: 2/22 태스크 완료

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료 표시로 변경

## 화면 목록 (11개 페이지)

| #   | 페이지                          | 라우트 (예상)                                             | 접근 권한 |
| --- | ------------------------------- | --------------------------------------------------------- | --------- |
| 1   | 로그인 / 회원가입               | `/auth/login`, `/auth/sign-up`                            | 비로그인  |
| 2   | 내 그룹 목록 (홈)               | `/protected/groups`                                       | 로그인    |
| 3   | 그룹 생성                       | `/protected/groups/new`                                   | 로그인    |
| 4   | 그룹 홈 (이벤트 목록 + 투표 탭) | `/protected/groups/[id]`                                  | 그룹 멤버 |
| 5   | 이벤트 생성/수정                | `/protected/groups/[id]/events/new`, `.../[eventId]/edit` | Host      |
| 6   | 이벤트 상세 (공지 + 참여 응답)  | `/protected/groups/[id]/events/[eventId]`                 | 그룹 멤버 |
| 7   | 참여 현황 상세                  | `/protected/groups/[id]/events/[eventId]/attendance`      | Host      |
| 8   | 투표 생성/수정                  | `/protected/groups/[id]/polls/new`, `.../[pollId]/edit`   | Host      |
| 9   | 투표 상세 (투표 + 결과)         | `/protected/groups/[id]/polls/[pollId]`                   | 그룹 멤버 |
| 10  | 멤버 관리                       | `/protected/groups/[id]/members`                          | Host      |
| 11  | 그룹 설정                       | `/protected/groups/[id]/settings`                         | Host      |

## DB 스키마 (8개 테이블)

- `groups` - 모임 그룹 정보
- `group_members` - 그룹 멤버십 및 역할 (host/member)
- `events` - 이벤트 정보 (제목, 날짜, 장소, 내용, 상태, RSVP 마감일)
- `rsvp` - 이벤트 참여 응답 (참가/불참/미정)
- `polls` - 투표 정보 (제목, 단일/복수 선택, 마감일)
- `poll_options` - 투표 선택지
- `poll_votes` - 투표 참여 기록
- `invitations` - 이메일 초대 정보

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 인증 시스템 구축** - 완료
  - 이메일/비밀번호 회원가입 및 로그인 구현
  - 구글 OAuth 로그인 구현
  - 비밀번호 찾기/변경 플로우 구현
  - 미들웨어 기반 세션 관리 및 인증 리디렉션
  - 관련 파일: `app/auth/*`, `components/login-form.tsx`, `components/sign-up-form.tsx`, `proxy.ts`

- **Task 002: 프로젝트 라우트 구조 및 빈 페이지 생성** ✅ - 완료
  - ✅ `app/protected/groups/page.tsx` (내 그룹 목록)
  - ✅ `app/protected/groups/new/page.tsx` (그룹 생성)
  - ✅ `app/protected/groups/[id]/page.tsx` (그룹 홈)
  - ✅ `app/protected/groups/[id]/events/new/page.tsx` (이벤트 생성)
  - ✅ `app/protected/groups/[id]/events/[eventId]/page.tsx` (이벤트 상세)
  - ✅ `app/protected/groups/[id]/events/[eventId]/edit/page.tsx` (이벤트 수정)
  - ✅ `app/protected/groups/[id]/events/[eventId]/attendance/page.tsx` (참여 현황)
  - ✅ `app/protected/groups/[id]/polls/new/page.tsx` (투표 생성)
  - ✅ `app/protected/groups/[id]/polls/[pollId]/page.tsx` (투표 상세)
  - ✅ `app/protected/groups/[id]/polls/[pollId]/edit/page.tsx` (투표 수정)
  - ✅ `app/protected/groups/[id]/members/page.tsx` (멤버 관리)
  - ✅ `app/protected/groups/[id]/settings/page.tsx` (그룹 설정)
  - ✅ 각 페이지는 페이지명과 "준비 중" 텍스트만 표시하는 빈 껍데기로 생성
  - ✅ `app/protected/groups/[id]/layout.tsx` 그룹 공통 레이아웃 골격 생성

- **Task 003: 공통 레이아웃 및 네비게이션 골격 구현**
  - `app/protected/layout.tsx` 수정: 사이드바 또는 상단 네비게이션 골격
  - 그룹 내부 탭 네비게이션 컴포넌트 (이벤트/투표/멤버/설정 탭)
  - 뒤로가기 및 브레드크럼 네비게이션 컴포넌트
  - 로딩 상태 및 에러 바운더리 공통 컴포넌트
  - 홈 페이지(`/`) 리디렉션: 로그인 사용자는 `/protected/groups`로 이동

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 004: 공통 컴포넌트 라이브러리 구현**
  - 더미 데이터 생성 유틸리티 (`lib/dummy-data.ts`) - 그룹, 이벤트, 투표, 멤버 등 목업 데이터
  - 상태 뱃지 컴포넌트 (이벤트 상태, RSVP 상태, 멤버 역할 표시)
  - 빈 상태(Empty State) 컴포넌트 (그룹/이벤트/투표가 없을 때)
  - 확인 다이얼로그 컴포넌트 (삭제, 취소 등 위험 동작 확인)
  - 카테고리 아이콘/뱃지 컴포넌트 (골프/수영/헬스/친목/기타)
  - shadcn/ui 추가 컴포넌트 설치: Dialog, Tabs, Select, Textarea, Avatar, Separator, Progress, Table

- **Task 005: 그룹 관련 페이지 UI 구현 (더미 데이터)**
  - 내 그룹 목록 페이지: 그룹 카드 리스트 (이름, 카테고리, 멤버 수, 최근 이벤트)
  - 그룹 생성 폼: 이름, 설명, 카테고리 선택 폼
  - 그룹 홈 페이지: 탭 기반 레이아웃 (이벤트 탭/투표 탭), 예정 이벤트 목록, 진행 중 투표 목록
  - 멤버 관리 페이지: 멤버 목록 테이블 (이름, 이메일, 역할, 가입일), 초대 폼, 초대 대기 목록
  - 그룹 설정 페이지: 그룹 정보 수정 폼
  - 반응형 디자인 적용 (모바일 우선)

- **Task 006: 이벤트 관련 페이지 UI 구현 (더미 데이터)**
  - 이벤트 생성/수정 폼: 제목, 날짜/시간, 장소, 내용(마크다운 또는 일반 텍스트), RSVP 마감일
  - 이벤트 상세 페이지: 이벤트 정보 표시, RSVP 버튼 (참가/불참/미정), 간단한 참여 현황 요약
  - 참여 현황 상세 페이지: 상태별 인원수 표시, 상태별 멤버 명단 리스트
  - 이벤트 목록 카드: 제목, 날짜, 장소, 상태 뱃지, RSVP 요약 표시
  - 반응형 디자인 적용 (모바일 우선)

- **Task 007: 투표 관련 페이지 UI 구현 (더미 데이터)**
  - 투표 생성/수정 폼: 제목, 설명, 선택지 2~6개 동적 추가/삭제, 단일/복수 선택 토글, 마감일
  - 투표 상세 페이지: 투표 정보 표시, 선택지 라디오/체크박스, 제출 버튼
  - 투표 결과 표시: 비율 바 차트, 각 선택지별 득표수/비율, 최종 결정 표시
  - 투표 목록 카드: 제목, 상태 (진행중/마감), 참여율, 마감일
  - 반응형 디자인 적용 (모바일 우선)

### Phase 3: 데이터베이스 & Supabase 설정

- **Task 008: TypeScript 타입 정의 및 DB 스키마 설계** - 우선순위
  - `lib/database.types.ts`에 8개 테이블 타입 추가 (groups, group_members, events, rsvp, polls, poll_options, poll_votes, invitations)
  - 각 테이블의 Row, Insert, Update 타입 정의
  - 공통 enum 타입 정의 (그룹 카테고리, 이벤트 상태, RSVP 상태, 멤버 역할 등)
  - API 응답 타입 및 폼 입력 타입 정의
  - Supabase SQL 마이그레이션 파일 작성 (실행은 Task 009)

- **Task 009: Supabase 데이터베이스 구축**
  - Supabase SQL Editor에서 8개 테이블 생성 (groups, group_members, events, rsvp, polls, poll_options, poll_votes, invitations)
  - RLS(Row Level Security) 정책 설정: 그룹 멤버만 그룹 데이터 접근, Host만 생성/수정/삭제 가능
  - 외래키 관계 설정 및 인덱스 생성
  - 트리거 설정: 그룹 생성 시 생성자를 Host로 자동 등록
  - 시드 데이터 SQL 작성 (개발/테스트용)

### Phase 4: 핵심 기능 API 연동 (Core)

- **Task 010: 그룹 CRUD API 및 데이터 연동** - 우선순위
  - 그룹 생성 Server Action 구현 (생성자 Host 자동 지정)
  - 내 그룹 목록 조회 (group_members 기반 필터링)
  - 그룹 정보 수정 Server Action (Host 전용)
  - 그룹 홈 데이터 조회 (이벤트 목록 + 투표 목록)
  - 더미 데이터를 실제 Supabase 쿼리로 교체
  - **테스트 체크리스트**:
    - Playwright MCP로 그룹 생성 플로우 E2E 테스트
    - 그룹 목록 조회 및 그룹 홈 페이지 데이터 표시 확인
    - Host가 아닌 멤버의 수정 시도 시 권한 에러 확인

- **Task 011: 멤버 초대 및 역할 관리 API 구현**
  - 이메일 초대 Server Action: invitations 테이블에 초대 레코드 생성
  - Supabase Edge Function 또는 트리거를 사용한 초대 이메일 발송
  - 초대 수락 플로우: 회원가입 시 초대 레코드 확인 후 그룹 자동 합류
  - 멤버 역할 변경 Server Action (Host 전용)
  - 멤버 목록 조회 API (profiles 테이블 조인)
  - 더미 데이터를 실제 Supabase 쿼리로 교체
  - **테스트 체크리스트**:
    - Playwright MCP로 초대 이메일 입력 및 발송 플로우 테스트
    - 초대받은 사용자 회원가입 후 그룹 자동 합류 확인
    - 멤버 역할 변경 및 권한 제어 테스트

- **Task 012: 이벤트 CRUD API 및 데이터 연동**
  - 이벤트 생성 Server Action (Host 전용, 폼 유효성 검증)
  - 이벤트 수정 Server Action (Host 전용)
  - 이벤트 취소/상태 변경 Server Action (Host 전용)
  - 이벤트 상세 조회 (RSVP 현황 요약 포함)
  - 이벤트 목록 조회 (그룹별 필터, 상태별 필터)
  - 더미 데이터를 실제 Supabase 쿼리로 교체
  - **테스트 체크리스트**:
    - Playwright MCP로 이벤트 생성/수정/취소 전체 플로우 E2E 테스트
    - 이벤트 목록 및 상세 페이지 데이터 표시 확인
    - Host가 아닌 멤버의 생성/수정 시도 시 권한 에러 확인

- **Task 013: RSVP(참여 응답) API 구현**
  - RSVP 응답 제출 Server Action (참가/불참/미정)
  - RSVP 응답 변경 Server Action (마감일 이전만 가능)
  - 참여 현황 조회: 상태별 인원수 및 멤버 명단
  - 이벤트 상세 페이지에 본인 RSVP 상태 표시 및 변경 UI 연동
  - 참여 현황 상세 페이지 데이터 연동
  - **테스트 체크리스트**:
    - Playwright MCP로 RSVP 참가/불참/미정 응답 제출 테스트
    - RSVP 마감일 이후 응답 변경 불가 확인
    - 참여 현황 인원수 및 명단 정확성 확인

- **Task 014: Phase 4 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 플로우 테스트 (회원가입 -> 그룹 생성 -> 멤버 초대 -> 이벤트 생성 -> RSVP)
  - RLS 정책 검증: 권한 없는 사용자의 데이터 접근 차단 확인
  - 에러 핸들링 테스트: 네트워크 에러, 유효성 검증 실패, 권한 부족 시나리오
  - 엣지 케이스 테스트: 동시 RSVP 제출, 삭제된 그룹 접근, 만료된 초대 처리

### Phase 5: 참여 기능 구현 (Engagement)

- **Task 015: 투표 CRUD API 및 데이터 연동**
  - 투표 생성 Server Action (Host 전용, 선택지 2~6개, 단일/복수 선택 설정)
  - 투표 수정 Server Action (Host 전용, 투표 시작 전만 수정 가능)
  - 투표 마감 Server Action (Host 전용)
  - 최종 결정 표시 Server Action (Host가 특정 선택지를 최종 결정으로 지정)
  - 투표 목록 조회 (그룹별 필터, 상태별 필터)
  - 더미 데이터를 실제 Supabase 쿼리로 교체
  - **테스트 체크리스트**:
    - Playwright MCP로 투표 생성/수정/마감 전체 플로우 E2E 테스트
    - 선택지 개수 제한 (2~6개) 유효성 검증 확인
    - Host가 아닌 멤버의 생성/수정 시도 시 권한 에러 확인

- **Task 016: 투표 참여 및 결과 확인 API 구현**
  - 투표 제출 Server Action (단일 선택: 라디오, 복수 선택: 체크박스)
  - 투표 변경 Server Action (마감 전만 가능)
  - 투표 결과 실시간 조회: 각 선택지별 득표수, 비율 계산
  - 투표 상세 페이지 데이터 연동 (본인 투표 상태 표시, 결과 바 차트)
  - **테스트 체크리스트**:
    - Playwright MCP로 투표 제출 및 결과 확인 플로우 테스트
    - 단일/복수 선택 모드별 동작 검증
    - 마감 후 투표 제출 불가 확인
    - 비율 계산 정확성 확인

- **Task 017: 이메일 알림 시스템 구현**
  - Supabase Edge Function으로 이메일 발송 구현 (Resend 또는 Supabase 내장 이메일)
  - 이벤트 생성/수정 시 그룹 멤버에게 알림 이메일 발송
  - 투표 생성 시 그룹 멤버에게 알림 이메일 발송
  - 이메일 템플릿 작성 (이벤트 알림, 투표 알림, 초대 이메일)
  - **테스트 체크리스트**:
    - 이벤트 생성 시 이메일 발송 트리거 확인
    - 투표 생성 시 이메일 발송 트리거 확인
    - 이메일 템플릿 렌더링 확인

- **Task 018: 그룹 설정 기능 완성**
  - 그룹 이름/설명/카테고리 수정 폼 데이터 연동
  - 그룹 삭제 기능 (Host 전용, 확인 다이얼로그)
  - 멤버 탈퇴 기능 (본인만 가능)
  - 멤버 강제퇴장 기능 (Host 전용)
  - **테스트 체크리스트**:
    - Playwright MCP로 그룹 설정 수정 플로우 테스트
    - 그룹 삭제 시 연관 데이터 정리 확인
    - 멤버 탈퇴/강제퇴장 후 접근 차단 확인

- **Task 019: Phase 5 통합 테스트**
  - 전체 투표 플로우 E2E 테스트 (투표 생성 -> 멤버 투표 -> 결과 확인 -> 마감 -> 최종 결정)
  - 이메일 알림 발송 통합 테스트
  - 그룹 설정 변경 및 멤버 관리 통합 테스트
  - 에러 핸들링 및 엣지 케이스 테스트

### Phase 6: 고급 기능 및 최적화

- **Task 020: 성능 최적화 및 UX 개선**
  - 페이지 로딩 최적화: React Suspense 경계 및 스트리밍 SSR 적용
  - 이미지 최적화: Next.js Image 컴포넌트 활용
  - 데이터 캐싱 전략: `revalidatePath` / `revalidateTag` 적용
  - Optimistic UI 적용: RSVP 응답, 투표 제출 시 즉시 UI 반영
  - 무한 스크롤 또는 페이지네이션 (이벤트/투표 목록)

- **Task 021: 접근성 및 다국어 지원**
  - WAI-ARIA 접근성 기준 적용 (키보드 네비게이션, 스크린 리더 지원)
  - 한국어 UI 텍스트 적용 (현재 영문 인증 UI 포함)
  - 날짜/시간 포맷 한국어 로케일 적용
  - SEO 메타 태그 및 Open Graph 설정

- **Task 022: 배포 및 모니터링**
  - Vercel 배포 설정 및 환경 변수 구성
  - 에러 모니터링 (Sentry 또는 Vercel Analytics)
  - 사용자 행동 분석 (Vercel Analytics)
  - CI/CD 파이프라인: GitHub Actions로 빌드/린트/타입 체크 자동화
  - 프로덕션 환경 E2E 테스트 (Playwright)

---

## 참고: 추후 확장 (Out of Scope)

다음 기능은 현재 MVP 범위에 포함되지 않으며, 향후 Phase로 확장 가능합니다:

- 카풀 매칭
- 비용 정산
- 채팅/댓글
- 모바일 앱 (React Native 또는 PWA)
