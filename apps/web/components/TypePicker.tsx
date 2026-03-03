import { Container, SegmentedControl, SegmentedControlProps } from "@mantine/core";
import React from "react";

export default function TypePicker(
  props: { value: "found" | "lost"; onChange: (value: "found" | "lost") => void } & Omit<
    SegmentedControlProps,
    "data" | "onChange" | "value"
  >,
) {
  return (
    <Container size="xs" px="md">
      <SegmentedControl
        data={[
          { label: "Znalezione", value: "found" },
          { label: "Zgubione", value: "lost" },
        ]}
        size="lg"
        radius="xl"
        withItemsBorders={false}
        fullWidth
        color="blue"
        {...props}
        onChange={(value) => props.onChange(value as "found" | "lost")}
        classNames={{
          ...props.classNames,
          indicator: "shadow-md!",
        }}
      />
    </Container>
  );
}
