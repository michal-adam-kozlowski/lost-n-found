import { InputWrapper, SegmentedControl, SegmentedControlProps } from "@mantine/core";
import React from "react";
import { ItemType } from "@/lib/utils/types";

export default function TypePicker(
  props: { value: ItemType; onChange: (value: ItemType) => void } & Omit<
    SegmentedControlProps,
    "data" | "onChange" | "value"
  >,
) {
  return (
    <InputWrapper label="Typ" labelProps={{ className: "px-0" }}>
      <SegmentedControl
        data={[
          { label: "Znalezione", value: "found" },
          { label: "Zgubione", value: "lost" },
        ]}
        size="sm"
        radius="sm"
        withItemsBorders={false}
        fullWidth
        color={props.value === "found" ? "green.8" : "red.8"}
        {...props}
        onChange={(value) => props.onChange(value as ItemType)}
        styles={{
          root: {
            background: "var(--mantine-color-white)",
            border: "calc(.0625rem * var(--mantine-scale)) solid var(--mantine-color-gray-4)",
            padding: "calc(.1875rem * var(--mantine-scale))",
          },
          indicator: {
            transitionProperty: "transform, width, height, background-color",
            marginTop: "calc(-0.0625rem * var(--mantine-scale))",
            marginLeft: "calc(-0.0625rem * var(--mantine-scale))",
          },
        }}
        classNames={{
          ...props.classNames,
          // indicator: "shadow-md!",
        }}
      />
    </InputWrapper>
  );
}
