"use client";

import { Badge, BadgeProps } from "@mantine/core";
import { useUnreadMessages } from "@/lib/context/UnreadMessagesContext";
import React from "react";

export function UnreadMessagesBadge({ ...props }: BadgeProps) {
  const { unreadCount } = useUnreadMessages();

  if (unreadCount === 0) return null;

  return (
    <Badge color="red" px={5} {...props}>
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}
