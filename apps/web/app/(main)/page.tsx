import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { IconEdit, IconMap2, IconMessages, IconPlus, IconSearch } from "@tabler/icons-react";
import React from "react";
import Logo from "@components/layout/Logo";
import screenshotList from "./screenshot_list.png";
import screenshotMap from "./screenshot_map.png";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <>
      <Center mt="-xl" mx={-10000} bg="blue.1" className="flex flex-col" pt={60} pb={60}>
        <Title order={2} mb={20} size={36}>
          Zgubiłeś coś? A może znalazłeś?
        </Title>
        <Text c="gray.8">Pomagamy rzeczom wrócić do właścicieli.</Text>
        <Text c="gray.8" mb={40}>
          Dodawaj i przeglądaj ogłoszenia w jednym miejscu.
        </Text>
        <Box>
          <Link href="/items?type=found&view=list&page=1">
            <Button leftSection={<IconSearch />} variant="default" radius="sm" mx="sm">
              Przeglądaj ogłoszenia
            </Button>
          </Link>
          <Link href="/add">
            <Button leftSection={<IconPlus />} variant="filled" color="blue" radius="sm" mx="sm">
              Dodaj ogłoszenie
            </Button>
          </Link>
        </Box>
      </Center>
      <Center pt={40} pb={30} className="flex flex-col">
        <Title order={3} mb={40}>
          Jak to działa?
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          <Card shadow="sm" className="flex flex-col items-center text-center text-balance" p="xl">
            <ThemeIcon variant="white" size={56} mb={12}>
              <IconEdit size={56} stroke={1.25} />
            </ThemeIcon>
            <Title order={4} mb={10}>
              Dodaj ogłoszenie
            </Title>
            <Divider
              my={4}
              w={60}
              style={{ "--divider-color": "var(--mantine-color-blue-6)", "--divider-size": "4px", borderRadius: 2 }}
            />
            <Text c="gray.8" mt={10}>
              Opisz przedmiot, dodaj zdjęcie i wybierz kategorię
            </Text>
          </Card>
          <Card shadow="sm" className="flex flex-col items-center text-center text-balance" p="xl">
            <ThemeIcon variant="white" size={56} mb={12}>
              <IconMap2 size={56} stroke={1.25} />
            </ThemeIcon>
            <Title order={4} mb={10}>
              Wskaż lokalizację
            </Title>
            <Divider
              my={4}
              w={60}
              style={{ "--divider-color": "var(--mantine-color-blue-6)", "--divider-size": "4px", borderRadius: 2 }}
            />
            <Text c="gray.8" mt={10}>
              Zaznacz miejsce zgubienia lub znalezienia na mapie
            </Text>
          </Card>
          <Card shadow="sm" className="flex flex-col items-center text-center text-balance" p="xl">
            <ThemeIcon variant="white" size={56} mb={12}>
              <IconMessages size={56} stroke={1.25} />
            </ThemeIcon>
            <Title order={4} mb={10}>
              Skontaktuj się
            </Title>
            <Divider
              my={4}
              w={60}
              style={{ "--divider-color": "var(--mantine-color-blue-6)", "--divider-size": "4px", borderRadius: 2 }}
            />
            <Text c="gray.8" mt={10}>
              Bezpiecznie wymieniaj wiadomości z użytkownikami
            </Text>
          </Card>
        </SimpleGrid>
      </Center>
      <Center pt={30} pb={80} className="flex flex-col">
        <Title order={3} mb={40}>
          Funkcjonalności
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" w="100%">
          <Card shadow="sm" className="flex flex-col text-balance" p="xl">
            <div className={styles.CardImage}>
              <Image
                src={screenshotList.src}
                alt="Screenshot widoku listy"
                fit="contain"
                w="auto"
                className={`absolute top-0 right-0 h-56 z-0`}
              />
            </div>
            <Title order={4} mb={16} className="z-10">
              Widok listy
            </Title>
            <List className="list-disc text-left z-10" mb={8}>
              <ListItem>Filtrowanie zgubione/znalezione</ListItem>
              <ListItem>Sortowanie po dacie</ListItem>
              <ListItem>Podgląd zdjęć </ListItem>
            </List>
          </Card>
          <Card shadow="sm" className="flex flex-col text-balance" p="xl">
            <div className={styles.CardImage}>
              <Image
                src={screenshotMap.src}
                alt="Screenshot widoku listy"
                fit="contain"
                w="auto"
                className={`absolute top-0 right-0 h-56 z-0`}
              />
            </div>
            <Title order={4} mb={16} className="z-10">
              Widok mapy
            </Title>
            <List className="list-disc text-left z-10" mb={8}>
              <ListItem>Pinezki z lokalizacją</ListItem>
              <ListItem>Podgląd szczegółów po kliknięciu</ListItem>
              <ListItem>Filtrowanie według kategorii</ListItem>
            </List>
          </Card>
        </SimpleGrid>
      </Center>
      <Center mx={-10000} bg="blue.1" className="flex flex-col" pt={70} pb={70}>
        <Title order={2} mb={30}>
          Nie zwlekaj. Twoja rzecz może juz na Ciebie czekać.
        </Title>
        <Box>
          <Link href="/items?type=found&view=list&page=1">
            <Button leftSection={<IconSearch />} variant="default" radius="sm" mx="sm">
              Przeglądaj ogłoszenia
            </Button>
          </Link>
          <Link href="/add">
            <Button leftSection={<IconPlus />} variant="filled" color="blue" radius="sm" mx="sm">
              Dodaj ogłoszenie
            </Button>
          </Link>
        </Box>
      </Center>
      <Center mx={-10000} bg="blue.9" className="flex flex-col" pt={50} pb={50} mb="-md">
        <Logo className="text-3xl text-white"></Logo>
        <Box mt={20} className="flex flex-row gap-8">
          <Link href="/">
            <Text c="gray.2" className="hover:underline!">
              Regulamin
            </Text>
          </Link>
          <Link href="/">
            <Text c="gray.2" className="hover:underline!">
              Polityka prywatności
            </Text>
          </Link>
          <Link href="/">
            <Text c="gray.2" className="hover:underline!">
              Kontakt
            </Text>
          </Link>
        </Box>
        <Box mt={20} className="flex flex-row gap-8">
          <Text c="gray.2" className="hover:underline!">
            &copy; LostNFound. Wszelkie prawa zastrzeżone.
          </Text>
        </Box>
      </Center>
    </>
  );
}
