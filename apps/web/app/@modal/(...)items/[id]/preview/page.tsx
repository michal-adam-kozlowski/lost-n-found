import ItemModal from "@components/items/ItemModal";
import ItemPage from "@/app/(main)/items/[id]/ItemPage";
import { getCurrentUser } from "@/actions/auth";

export default async function InterceptedItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  return (
    <ItemModal>
      <ItemPage itemId={id} currentUserId={user?.id} />
    </ItemModal>
  );
}
