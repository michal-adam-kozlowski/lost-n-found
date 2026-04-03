import ItemPage from "@/app/(main)/items/[id]/ItemPage";
import { getCurrentUser } from "@/actions/auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();

  return <ItemPage itemId={id} currentUserId={user?.id} />;
}
