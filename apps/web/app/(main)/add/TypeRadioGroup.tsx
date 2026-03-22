import { Group, RadioCard, RadioGroup, RadioGroupProps, RadioIndicator, Text } from "@mantine/core";
import styles from "./TypeRadioGroup.module.scss";

export default function TypeRadioGroup(props: Readonly<Omit<RadioGroupProps, "children">>) {
  return (
    <RadioGroup {...props}>
      <Group gap="sm" dir="row">
        <RadioCard value="lost" p="sm" c="blue.7" className={styles.Root}>
          <RadioIndicator color="blue.7" />
          <div>
            <Text c="blue.7" fw={600} mb={3}>
              Zgubiłem rzecz
            </Text>
            <Text c="gray.7" size="sm">
              Dodaj ogłoszenie, jeśli coś zgubiłeś
            </Text>
          </div>
        </RadioCard>
        <RadioCard value="found" p="sm" c="green.7" className={styles.Root}>
          <RadioIndicator color="green.7" />
          <div>
            <Text c="green.7" fw={600} mb={3}>
              Znalazłem rzecz
            </Text>
            <Text c="gray.7" size="sm">
              Dodaj ogłoszenie, jeśli coś znalazłeś
            </Text>
          </div>
        </RadioCard>
      </Group>
    </RadioGroup>
  );
}
