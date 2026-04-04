import { Carousel, CarouselSlide } from "@mantine/carousel";
import { Image, Text } from "@mantine/core";
import React from "react";
import styles from "./ImagesViewer.module.scss";
import { IconPhoto } from "@tabler/icons-react";

interface ImagesViewerProps {
  images: string[];
  height: number | string;
  emptyIcon?: React.ReactNode;
  emptyPlaceholder?: string;
}

export default function ImagesViewer({ images, height, emptyIcon, emptyPlaceholder }: Readonly<ImagesViewerProps>) {
  if (images.length === 0) {
    return (
      <div className={styles.EmptyContainer} style={{ height }}>
        {emptyIcon || <IconPhoto size={48} stroke={1.5} />}
        {emptyPlaceholder && <Text>{emptyPlaceholder}</Text>}
      </div>
    );
  }
  if (images.length == 1) {
    return <Image src={images[0]} height={height} alt="" h={height} className={styles.SingleImage} />;
  }

  const slides = images.map((image) => (
    <CarouselSlide key={image} h={height}>
      <Image src={image} height={height} alt="" h={height} fit="contain" bg="gray.6" style={{ height: height }} />
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
