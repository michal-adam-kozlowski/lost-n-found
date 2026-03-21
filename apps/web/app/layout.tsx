import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.scss";
import { ColorSchemeScript, createTheme, mantineHtmlProps, MantineProvider } from "@mantine/core";
import React from "react";
import { Inter } from "next/font/google";
import ClientProviders from "@/app/ClientProviders";
import { Notifications } from "@mantine/notifications";

const inter = Inter({ weight: "variable", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "LostNFound",
  description: "Wirtualne biuro rzeczy znalezionych",
};

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  primaryColor: "blue",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className} {...mantineHtmlProps}>
      <head>
        <title></title>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <ClientProviders>{children}</ClientProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
