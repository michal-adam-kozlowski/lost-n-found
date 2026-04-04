"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ActionIcon, Flex, Image, Overlay, Paper, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 25 * 1024 ** 2; // 25 MB

export interface ExistingImage {
  id: string;
  url: string;
}

interface ImageUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImages?: ExistingImage[];
  onDeleteExistingImage?: (imageId: string) => void;
  maxFiles?: number;
}

export default function ImageUploader({
  files,
  onFilesChange,
  existingImages = [],
  onDeleteExistingImage,
  maxFiles = MAX_FILES,
}: Readonly<ImageUploaderProps>) {
  const totalCount = existingImages.length + files.length;
  const remainingSlots = maxFiles - totalCount;

  const previews = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleDrop = (accepted: File[]) => {
    const available = maxFiles - totalCount;
    if (available <= 0) {
      notifications.show({
        title: "Limit zdjęć",
        message: `Możesz dodać maksymalnie ${maxFiles} zdjęć.`,
        color: "orange",
      });
      return;
    }
    const toAdd = accepted.slice(0, available);
    if (accepted.length > available) {
      notifications.show({
        title: "Limit zdjęć",
        message: `Dodano ${toAdd.length} z ${accepted.length} wybranych zdjęć (limit: ${maxFiles}).`,
        color: "orange",
      });
    }
    onFilesChange([...files, ...toAdd]);
  };

  const handleRemoveLocal = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const handleRemoveExisting = (imageId: string) => {
    onDeleteExistingImage?.(imageId);
  };

  return (
    <Stack gap="md">
      {(existingImages.length > 0 || previews.length > 0) && (
        <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 5 }} spacing="sm">
          {existingImages.map((img) => (
            <ImageThumbnail key={img.id} src={img.url} onRemove={() => handleRemoveExisting(img.id)} />
          ))}
          {previews.map((p, index) => (
            <ImageThumbnail
              key={`local-${index}-${p.file.name}`}
              src={p.url}
              onRemove={() => handleRemoveLocal(index)}
            />
          ))}
        </SimpleGrid>
      )}

      {remainingSlots > 0 && (
        <Dropzone
          onDrop={handleDrop}
          onReject={(rejections) => {
            rejections.forEach((r) => {
              r.errors.forEach((e) => {
                notifications.show({
                  title: "Błąd pliku",
                  message: `${r.file.name}: ${e.message}`,
                  color: "red",
                });
              });
            });
          }}
          maxSize={MAX_FILE_SIZE}
          accept={IMAGE_MIME_TYPE}
          multiple
        >
          <Stack
            align="center"
            justify="center"
            gap="xs"
            mih={totalCount > 0 ? 120 : 220}
            style={{ pointerEvents: "none" }}
          >
            <DropzoneAccept>
              <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
            </DropzoneAccept>
            <DropzoneReject>
              <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
            </DropzoneReject>
            <DropzoneIdle>
              <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
            </DropzoneIdle>

            <Text size={totalCount > 0 ? "md" : "xl"} inline>
              Przeciągnij zdjęcia lub kliknij, aby dodać
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              PNG, JPG, WEBP • maks. {maxFiles} zdjęć • do 25 MB każde
              {totalCount > 0 && ` • pozostało ${remainingSlots}`}
            </Text>
          </Stack>
        </Dropzone>
      )}

      {remainingSlots <= 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Osiągnięto limit {maxFiles} zdjęć. Usuń istniejące, aby dodać nowe.
        </Text>
      )}
    </Stack>
  );
}

function ImageThumbnail({ src, onRemove }: Readonly<{ src: string; onRemove: () => void }>) {
  const [hovered, setHovered] = useState(false);

  return (
    <Paper
      pos="relative"
      radius="md"
      withBorder
      bg="gray.6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image src={src} alt="" h={140} w="100%" fit="contain" radius="md" />
      {hovered && (
        <Overlay backgroundOpacity={0.4} radius="md">
          <Flex display="flex" align="center" justify="center" h="100%">
            <Tooltip label="Usuń zdjęcie">
              <ActionIcon
                variant="filled"
                color="red"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Overlay>
      )}
    </Paper>
  );
}
