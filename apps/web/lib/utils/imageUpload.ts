import { confirmImageUpload, presignImageUpload } from "@/actions/images";

export async function uploadImages(itemId: string, files: File[]): Promise<void> {
  const errors: Error[] = [];

  for (const file of files) {
    try {
      const presign = await presignImageUpload(itemId, file.name, file.type, file.size);

      const uploadRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: presign.headers,
      });

      if (!uploadRes.ok) {
        errors.push(new Error(`S3 upload failed for ${file.name}: ${uploadRes.status}`));
        continue;
      }

      await confirmImageUpload(itemId, presign.imageId);
    } catch (err) {
      console.error(`Failed to upload ${file.name}:`, err);
      errors.push(err instanceof Error ? err : new Error(String(err)));
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors, `Failed to upload ${errors.length} of ${files.length} images`);
  }
}
