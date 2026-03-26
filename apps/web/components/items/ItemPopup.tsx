"use client";

import React from "react";
import ItemCard from "@components/items/ItemCard";
import { ItemResponse } from "@lost-n-found/api-client";
import dayjs from "dayjs";

export default function ItemPopup(item: ItemResponse) {
  return (
    <ItemCard
      item={{ ...item, occurredAt: dayjs(item.occurredAt).locale("pl").format("DD MMMM YYYY") }}
      small
      cardProps={{ shadow: "md", withBorder: true }}
    />
  );
}
