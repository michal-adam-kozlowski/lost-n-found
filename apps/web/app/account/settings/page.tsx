import ChangePasswordSection from "@/app/account/settings/ChangePasswordSection";
import DeleteAccountSection from "@/app/account/settings/DeleteAccountSection";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordSection />
      <DeleteAccountSection />
    </div>
  );
}
