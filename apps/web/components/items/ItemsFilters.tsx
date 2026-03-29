"use client";

import { Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React, { useEffect } from "react";
import { useCategories } from "@/lib/context/CategoriesContext";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import TypePicker from "@components/TypePicker";

export interface ItemsFiltersValues {
  type: "found" | "lost";
  categoryId: string;
  categorySearch: string;
  occurredAtRange: [string | null, string | null];
}

export default function ItemsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCategories();
  const form = useForm<ItemsFiltersValues>({
    mode: "controlled",
    initialValues: {
      type: (searchParams.get("type") as "found" | "lost") || "found",
      categoryId: searchParams.get("categoryId") || "",
      categorySearch: "",
      occurredAtRange: [searchParams.get("occurredAtFrom") || null, searchParams.get("occurredAtTo") || null],
    },
    onValuesChange: (values) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", values.type);
      if (values.categoryId) {
        params.set("categoryId", values.categoryId);
      } else {
        params.delete("categoryId");
      }
      if (values.occurredAtRange[0]) {
        params.set("occurredAtFrom", values.occurredAtRange[0]);
      } else {
        params.delete("occurredAtFrom");
      }
      if (values.occurredAtRange[1]) {
        params.set("occurredAtTo", values.occurredAtRange[1]);
      } else {
        params.delete("occurredAtTo");
      }
      if (params.toString() === searchParams.toString()) return;
      const queryString = params.toString();
      router.replace(`?${queryString}`);
    },
  });
  useEffect(() => {
    form.setValues({
      type: (searchParams.get("type") as "found" | "lost") || "found",
      categoryId: searchParams.get("categoryId") || "",
      occurredAtRange: [searchParams.get("occurredAtFrom") || null, searchParams.get("occurredAtTo") || null],
    });
    if (searchParams.get("categoryId") === null) {
      form.setFieldValue("categorySearch", "");
    }
  }, [searchParams]);

  return (
    <>
      <TypePicker value={form.values.type} onChange={(value) => form.setFieldValue("type", value)} />
      <Select
        label="Kategoria"
        placeholder="Wybierz kategorię"
        data={categories.map((c) => ({ label: c.name, value: c.id }))}
        disabled={categoriesLoading}
        searchable
        searchValue={form.values.categorySearch}
        onSearchChange={(value) => {
          form.setFieldValue("categorySearch", value);
        }}
        miw={180}
        flex={1}
        allowDeselect={true}
        clearable
        {...form.getInputProps("categoryId")}
      />
      <DatePickerInput
        type="range"
        allowSingleDateInRange
        label={form.values.type === "found" ? "Zakres daty znalezienia" : "Zakres daty zagubienia"}
        placeholder="Wybierz zakres dat"
        locale="pl"
        valueFormat={"DD MMMM YYYY"}
        miw={180}
        flex={1}
        maxDate={new Date()}
        clearable
        popoverProps={{
          position: "bottom",
        }}
        {...form.getInputProps("occurredAtRange")}
      />
    </>
  );
}
