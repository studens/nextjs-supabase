export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // id는 향후 탭 네비게이션 구현 시 사용
  void (await params);

  return <div>{children}</div>;
}
