import { GroupTabNav } from "@/components/group-tab-nav";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex w-full flex-col gap-4">
      <BreadcrumbNav />
      <GroupTabNav groupId={id} />
      <div>{children}</div>
    </div>
  );
}
