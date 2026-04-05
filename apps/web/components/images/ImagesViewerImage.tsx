"use client";

import { LoadedImage } from "@components/images/ImagesViewer";
import { Image } from "@mantine/core";
import styles from "@components/images/ImagesViewer.module.scss";
import React, { useState } from "react";

export default function ImagesViewerImage({
  image,
  loading,
  height,
  fetchPriority,
}: Readonly<
  {
    image: LoadedImage;
    loading?: boolean;
    height: number | string;
    fetchPriority?: "auto" | "high" | "low";
  } & React.ComponentProps<typeof Image>
>) {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (loading) {
    if (image?.blurDataUrl) {
      return (
        <div className={styles.BlurPlaceholder} style={{ height }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.blurDataUrl} alt="" />
        </div>
      );
    }
    return <div className={styles.LoadingPlaceholder} style={{ height }}></div>;
  }

  const showBlur = !imgLoaded && !!image?.blurDataUrl;

  return (
    <div className={styles.SingleImageContainer} style={{ height }}>
      {showBlur && (
        <div className={styles.BlurPlaceholder} style={{ position: "absolute", inset: 0, zIndex: 1, height }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.blurDataUrl} alt="" />
        </div>
      )}
      <Image
        src={image.url}
        height={height}
        alt=""
        h={height}
        className={styles.SingleImage}
        fetchPriority={fetchPriority}
        onLoad={() => setImgLoaded(true)}
        style={{
          position: showBlur ? "absolute" : undefined,
          inset: showBlur ? 0 : undefined,
          zIndex: 2,
          opacity: imgLoaded ? 1 : 0,
        }}
      />
    </div>
  );
}
