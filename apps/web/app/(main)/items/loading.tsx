import { Loader } from "@mantine/core";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen fixed top-0 left-0">
      <Loader color="blue" />
    </div>
  );
}
