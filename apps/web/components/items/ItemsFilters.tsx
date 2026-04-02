"use client";

import { Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React, { useEffect } from "react";
import { useCategories } from "@/lib/context/CategoriesContext";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import TypePicker from "@components/TypePicker";
import { useLoading } from "@/lib/context/LoadingContext";
import { ItemType } from "@/lib/utils/types";
import { ItemsViewOptions } from "@/lib/utils/ItemsViewOptions";

export interface ItemsFiltersValues {
  type?: ItemType;
  categoryId: string;
  categorySearch: string;
  occurredAtRange: [string | null, string | null];
}

export default function ItemsFilters({ hideType }: { hideType?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCategories();
  const { setLoading } = useLoading();

  const initialOptions = ItemsViewOptions.fromQueryParams(searchParams);

  const form = useForm<ItemsFiltersValues>({
    mode: "controlled",
    initialValues: {
      type: initialOptions.type || (hideType ? undefined : "found"),
      categoryId: initialOptions.categoryIds ? initialOptions.categoryIds[0] : "",
      categorySearch: "",
      occurredAtRange: ItemsViewOptions.formatDateRange(initialOptions.occurredAtRange || [null, null]),
    },
    onValuesChange: (values) => {
      const oldOptions = ItemsViewOptions.fromQueryParams(searchParams);
      const newOptions = oldOptions.copyWith({
        type: values.type,
        categoryIds: values.categoryId ? [values.categoryId] : undefined,
        occurredAtRange: ItemsViewOptions.parseDateRange(values.occurredAtRange),
      });
      if (oldOptions.toQueryString() === newOptions.toQueryString()) {
        return;
      }
      newOptions.page = 1;
      router.replace(`${newOptions.getRedirectUrl()}`);
    },
  });
  useEffect(() => {
    setLoading("itemsFilters", false);
    const options = ItemsViewOptions.fromQueryParams(searchParams);
    form.setValues({
      type: options.type || (hideType ? undefined : "found"),
      categoryId: options.categoryIds ? options.categoryIds[0] : "",
      occurredAtRange: ItemsViewOptions.formatDateRange(options.occurredAtRange || [null, null]),
    });
    if (!options.categoryIds || options.categoryIds.length === 0) {
      form.setFieldValue("categorySearch", "");
    }
  }, [searchParams]);

  return (
    <>
      {!hideType && <TypePicker value={form.values.type!} onChange={(value) => form.setFieldValue("type", value)} />}
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
