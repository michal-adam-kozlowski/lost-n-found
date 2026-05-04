import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/carousel/styles.css";
import "mantine-datatable/styles.css";
import "dayjs/locale/pl";
import "./globals.css";
import { ColorSchemeScript, createTheme, mantineHtmlProps, MantineProvider } from "@mantine/core";
import React from "react";
import { Inter } from "next/font/google";
import ClientProviders from "@/app/ClientProviders";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

const inter = Inter({ weight: "variable", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "LostNFound",
  description: "Wirtualne biuro rzeczy znalezionych",
};

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "blue",
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal?: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className} {...mantineHtmlProps}>
      <head>
        <title></title>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ModalsProvider modalProps={{ removeScrollProps: { enabled: false }, className: "maplibre-modal-ignore" }}>
            <Notifications />
            <ClientProviders>
              {children}
              {modal}
            </ClientProviders>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
