import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Text } from "@mantine/core";
import React from "react";
import styles from "./ImagesViewer.module.scss";
import { IconPhoto } from "@tabler/icons-react";
import ImagesViewerImage from "@components/images/ImagesViewerImage";

export type LoadedImage = {
  url: string;
  blurDataUrl?: string;
};

interface ImagesViewerProps {
  images: LoadedImage[];
  loading?: boolean;
  height: number | string;
  emptyIcon?: React.ReactNode;
  emptyPlaceholder?: string;
}

export default function ImagesViewer({
  images,
  loading,
  height,
  emptyIcon,
  emptyPlaceholder,
}: Readonly<ImagesViewerProps>) {
  if (loading) {
    if (images[0]?.blurDataUrl) {
      return <ImagesViewerImage image={images[0]} loading height={height} />;
    }
    return (
      <div className={styles.LoadingPlaceholder} style={{ height }}>
        {emptyIcon || <IconPhoto size={48} stroke={1.5} />}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.EmptyContainer} style={{ height }}>
        {emptyIcon || <IconPhoto size={48} stroke={1.5} />}
        {emptyPlaceholder && <Text>{emptyPlaceholder}</Text>}
      </div>
    );
  }
  if (images.length == 1) {
    return <ImagesViewerImage image={images[0]} height={height} />;
  }

  const slides = images.map((image, index) => (
    <CarouselSlide key={image.url} h={height}>
      <ImagesViewerImage image={image} height={height} fetchPriority={index === 0 ? "high" : "auto"} />
    </CarouselSlide>
  ));

  return (
    <Carousel
      withIndicators
      emblaOptions={{ loop: true, duration: 10 }}
      classNames={{
        root: styles.Carousel,
        controls: styles.CarouselControls,
        indicator: styles.CarouselIndicator,
      }}
      h={height}
      styles={{
        viewport: { height: height, maxHeight: height },
        container: { height: height, maxHeight: height },
      }}
    >
      {slides}
    </Carousel>
  );
}
