import { Button } from "@mantine/core";
import { cacheLife, cacheTag, updateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default async function ItemsPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("items");
  const items = await fetch(`${API_URL}/api/items`).then((r) => {
    return r.json() as Promise<object[]>;
  });

  const addItem = async () => {
    "use server";
    await fetch(`${API_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "AAAAAAA",
        type: "lost",
        description: "BBBBBBB",
        latitude: 12.345,
        longitude: 12.345,
      }),
    });
    updateTag("items");
  };

  return (
    <>
      <form action={addItem}>
        <Button variant="filled" color="blue" type="submit">
          Add item
        </Button>
      </form>
      <div>{JSON.stringify(items)}</div>
    </>
  );
}
