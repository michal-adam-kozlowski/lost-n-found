import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";
import React from "react";

export const metadata: Metadata = {
  title: "LostNFound",
  description: "Virtual lost-and-found office",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <title></title>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
