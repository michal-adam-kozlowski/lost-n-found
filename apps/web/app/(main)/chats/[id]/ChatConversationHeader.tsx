"use client";

import type { ChatResponse } from "@lost-n-found/api-client";
import Link from "next/link";
import { Anchor, Badge, Box, Flex, Text, Title } from "@mantine/core";
import { useItemImageUrls } from "@/lib/hooks/useItemImageUrls";
import ImagesViewer from "@components/images/ImagesViewer";
import dayjs from "dayjs";

interface Props {
  chat: ChatResponse;
}

export default function ChatConversationHeader({ chat }: Props) {
  const thumbnailIds = chat.imageId ? [chat.imageId] : [];
  const { urls: thumbnailUrls, loading: thumbnailLoading } = useItemImageUrls(chat.itemId, thumbnailIds, "thumbnail");
  const thumbnailUrl = thumbnailUrls[0];

  const showThumbnail = !!chat.imageId;

  const occuredAt = chat.itemOccurredAt ? dayjs(chat.itemOccurredAt).locale("pl").format("DD MMMM YYYY") : null;

  return (
    <Box p="md" style={{ borderBottom: "1px solid var(--mantine-color-default-border)", flexShrink: 0 }}>
      <Flex gap="sm" align="flex-start">
        {showThumbnail && (
          <Box w={68} h={68}>
            <ImagesViewer
              images={[{ url: thumbnailUrl, blurDataUrl: chat.imageBlurDataUrl! }]}
              height={68}
              loading={thumbnailLoading}
            />
          </Box>
        )}
        <Flex style={{ minWidth: 0, flex: 1 }} direction="column">
          <Badge color={chat.itemType === "lost" ? "red" : "green"} variant="light" size="sm" mb={1}>
            {chat.itemType === "lost" ? "Zgubione" : "Znalezione"}
          </Badge>
          <Title order={4}>
            <Text component="span" c="black">
              {chat.isItemOwner ? `Zapytanie #${chat.itemChatCount} o ` : `Twoje zapytanie o `}
            </Text>
            <Anchor component={Link} href={`/items/${chat.itemId}`} underline="hover" fw={600}>
              {chat.itemTitle}
            </Anchor>
          </Title>
          <Flex align="center" gap={6} mt={4} wrap="wrap">
            <Text size="sm" c="dimmed">
              {chat.itemLocationLabel}
              {chat.itemLocationLabel && occuredAt && " • "}
              {occuredAt}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
