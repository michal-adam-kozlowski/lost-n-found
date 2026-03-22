import { twMerge } from "tailwind-merge";

export default function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <div className="pe-2">
      <span className={twMerge("text-xl font-extrabold text-black", className)}>LostNFound</span>
    </div>
  );
}
