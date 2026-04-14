// ============================================================
// 타입 정의 (Task 008에서 DB 공식 타입으로 교체 예정)
// ============================================================

export type GroupCategory =
  | "golf"
  | "swimming"
  | "fitness"
  | "social"
  | "other";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type RsvpStatus = "attending" | "not_attending" | "undecided";
export type MemberRole = "host" | "member";
export type InvitationStatus = "pending" | "accepted" | "expired";

export type Group = {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  created_by: string;
  created_at: string;
  member_count?: number;
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: MemberRole;
  joined_at: string;
};

export type Event = {
  id: string;
  group_id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: EventStatus;
  rsvp_deadline: string | null;
};

export type Rsvp = {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
};

export type Poll = {
  id: string;
  group_id: string;
  title: string;
  description: string;
  is_multiple: boolean;
  deadline: string | null;
  is_closed: boolean;
};

export type PollOption = {
  id: string;
  poll_id: string;
  text: string;
};

export type PollVote = {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
};

export type GroupInvitation = {
  id: string;
  group_id: string;
  email: string;
  status: InvitationStatus;
  invited_at: string;
  expires_at: string;
};

// ============================================================
// 더미 데이터
// ============================================================

export const DUMMY_GROUPS: Group[] = [
  {
    id: "group-001",
    name: "주말 골프 모임",
    description: "매주 토요일 함께 라운딩하는 골프 동호회입니다.",
    category: "golf",
    created_by: "user-001",
    created_at: "2026-01-10T09:00:00Z",
    member_count: 12,
  },
  {
    id: "group-002",
    name: "아침 수영 클럽",
    description: "평일 아침 6시 수영장에서 만나요.",
    category: "swimming",
    created_by: "user-002",
    created_at: "2026-02-01T06:00:00Z",
    member_count: 8,
  },
  {
    id: "group-003",
    name: "헬스 트레이닝 팀",
    description: "서로 동기부여하며 꾸준히 운동하는 모임입니다.",
    category: "fitness",
    created_by: "user-003",
    created_at: "2026-02-15T10:00:00Z",
    member_count: 15,
  },
  {
    id: "group-004",
    name: "금요일 친목 모임",
    description: "매월 마지막 금요일 저녁 식사 모임입니다.",
    category: "social",
    created_by: "user-001",
    created_at: "2026-03-01T12:00:00Z",
    member_count: 20,
  },
  {
    id: "group-005",
    name: "독서 토론 그룹",
    description: "격주로 책을 읽고 함께 토론합니다.",
    category: "other",
    created_by: "user-004",
    created_at: "2026-03-10T14:00:00Z",
    member_count: 6,
  },
];

export const DUMMY_MEMBERS: GroupMember[] = [
  {
    id: "member-001",
    group_id: "group-001",
    user_id: "user-001",
    email: "host@example.com",
    full_name: "김호스트",
    role: "host",
    joined_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "member-002",
    group_id: "group-001",
    user_id: "user-002",
    email: "member1@example.com",
    full_name: "이멤버",
    role: "member",
    joined_at: "2026-01-12T10:00:00Z",
  },
  {
    id: "member-003",
    group_id: "group-001",
    user_id: "user-003",
    email: "member2@example.com",
    full_name: "박멤버",
    role: "member",
    joined_at: "2026-01-15T11:00:00Z",
  },
  {
    id: "member-004",
    group_id: "group-001",
    user_id: "user-004",
    email: "member3@example.com",
    full_name: null,
    role: "member",
    joined_at: "2026-01-20T09:00:00Z",
  },
];

export const DUMMY_EVENTS: Event[] = [
  {
    id: "event-001",
    group_id: "group-001",
    title: "4월 정기 라운딩",
    date: "2026-04-19T07:00:00Z",
    location: "서울 레이크사이드 골프클럽",
    description: "4월 정기 모임입니다. 18홀 라운딩 후 식사 예정입니다.",
    status: "upcoming",
    rsvp_deadline: "2026-04-16T23:59:00Z",
  },
  {
    id: "event-002",
    group_id: "group-001",
    title: "3월 정기 라운딩",
    date: "2026-03-22T07:00:00Z",
    location: "경기 파인밸리 골프클럽",
    description: "3월 정기 모임이었습니다.",
    status: "completed",
    rsvp_deadline: "2026-03-19T23:59:00Z",
  },
  {
    id: "event-003",
    group_id: "group-001",
    title: "2월 번개 라운딩",
    date: "2026-02-10T08:00:00Z",
    location: "인천 스카이72 골프클럽",
    description: "날씨가 좋아 번개로 잡은 라운딩입니다.",
    status: "cancelled",
    rsvp_deadline: "2026-02-08T23:59:00Z",
  },
  {
    id: "event-004",
    group_id: "group-004",
    title: "4월 저녁 식사 모임",
    date: "2026-04-25T18:30:00Z",
    location: "강남 한식당",
    description: "4월의 마지막 금요일 저녁 식사 모임입니다.",
    status: "upcoming",
    rsvp_deadline: "2026-04-23T23:59:00Z",
  },
];

export const DUMMY_RSVP: Rsvp[] = [
  {
    id: "rsvp-001",
    event_id: "event-001",
    user_id: "user-001",
    status: "attending",
  },
  {
    id: "rsvp-002",
    event_id: "event-001",
    user_id: "user-002",
    status: "attending",
  },
  {
    id: "rsvp-003",
    event_id: "event-001",
    user_id: "user-003",
    status: "not_attending",
  },
  {
    id: "rsvp-004",
    event_id: "event-001",
    user_id: "user-004",
    status: "undecided",
  },
  {
    id: "rsvp-005",
    event_id: "event-004",
    user_id: "user-001",
    status: "attending",
  },
];

export const DUMMY_POLLS: Poll[] = [
  {
    id: "poll-001",
    group_id: "group-001",
    title: "5월 라운딩 날짜 투표",
    description: "5월 정기 라운딩 날짜를 선택해주세요.",
    is_multiple: false,
    deadline: "2026-04-25T23:59:00Z",
    is_closed: false,
  },
  {
    id: "poll-002",
    group_id: "group-001",
    title: "선호하는 골프장 투표",
    description: "다음 라운딩 장소를 복수 선택해주세요.",
    is_multiple: true,
    deadline: "2026-03-15T23:59:00Z",
    is_closed: true,
  },
  {
    id: "poll-003",
    group_id: "group-004",
    title: "4월 식사 메뉴 투표",
    description: "이번 달 메뉴를 선택해주세요.",
    is_multiple: false,
    deadline: "2026-04-22T23:59:00Z",
    is_closed: false,
  },
];

export const DUMMY_POLL_OPTIONS: PollOption[] = [
  { id: "option-001", poll_id: "poll-001", text: "5월 3일 (토)" },
  { id: "option-002", poll_id: "poll-001", text: "5월 10일 (토)" },
  { id: "option-003", poll_id: "poll-001", text: "5월 17일 (토)" },
  { id: "option-004", poll_id: "poll-002", text: "서울 레이크사이드" },
  { id: "option-005", poll_id: "poll-002", text: "경기 파인밸리" },
  { id: "option-006", poll_id: "poll-002", text: "인천 스카이72" },
  { id: "option-007", poll_id: "poll-003", text: "한식 (한정식)" },
  { id: "option-008", poll_id: "poll-003", text: "일식 (오마카세)" },
  { id: "option-009", poll_id: "poll-003", text: "중식 (코스요리)" },
];

export const DUMMY_INVITATIONS: GroupInvitation[] = [
  {
    id: "invite-001",
    group_id: "group-001",
    email: "newmember1@example.com",
    status: "pending",
    invited_at: "2026-04-10T10:00:00Z",
    expires_at: "2026-04-17T10:00:00Z",
  },
  {
    id: "invite-002",
    group_id: "group-001",
    email: "newmember2@example.com",
    status: "pending",
    invited_at: "2026-04-12T14:00:00Z",
    expires_at: "2026-04-19T14:00:00Z",
  },
  {
    id: "invite-003",
    group_id: "group-001",
    email: "accepted@example.com",
    status: "accepted",
    invited_at: "2026-03-01T09:00:00Z",
    expires_at: "2026-03-08T09:00:00Z",
  },
  {
    id: "invite-004",
    group_id: "group-001",
    email: "expired@example.com",
    status: "expired",
    invited_at: "2026-02-01T09:00:00Z",
    expires_at: "2026-02-08T09:00:00Z",
  },
];

export const DUMMY_POLL_VOTES: PollVote[] = [
  {
    id: "vote-001",
    poll_id: "poll-001",
    option_id: "option-001",
    user_id: "user-001",
  },
  {
    id: "vote-002",
    poll_id: "poll-001",
    option_id: "option-002",
    user_id: "user-002",
  },
  {
    id: "vote-003",
    poll_id: "poll-001",
    option_id: "option-002",
    user_id: "user-003",
  },
  {
    id: "vote-004",
    poll_id: "poll-002",
    option_id: "option-004",
    user_id: "user-001",
  },
  {
    id: "vote-005",
    poll_id: "poll-002",
    option_id: "option-005",
    user_id: "user-001",
  },
  {
    id: "vote-006",
    poll_id: "poll-002",
    option_id: "option-004",
    user_id: "user-002",
  },
];
