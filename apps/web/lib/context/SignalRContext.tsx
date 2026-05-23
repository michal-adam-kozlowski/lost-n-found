"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "@/lib/context/AuthContext";

type GenericHandler = (payload: unknown) => void;

interface SignalRContextValue {
  subscribe: <T>(event: string, handler: (payload: T) => void) => () => void;
}

const SignalRContext = createContext<SignalRContextValue>({
  subscribe: () => () => {},
});

interface SignalRProviderProps {
  children: React.ReactNode;
  hubUrl: string;
}

export function SignalRProvider({ children, hubUrl }: Readonly<SignalRProviderProps>) {
  const { token } = useAuth();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const tokenRef = useRef<string | null>(token);
  const listenersRef = useRef<Map<string, Set<GenericHandler>>>(new Map());
  const registeredEventsRef = useRef<Set<string>>(new Set());

  // eslint-disable-next-line react-hooks/refs
  tokenRef.current = token;

  function buildConnection(): signalR.HubConnection {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => tokenRef.current ?? "",
      })
      .withAutomaticReconnect()
      .build();

    registeredEventsRef.current = new Set();

    for (const event of listenersRef.current.keys()) {
      const evt = event;
      connection.on(evt, (payload: unknown) => {
        listenersRef.current.get(evt)?.forEach((h) => h(payload));
      });
      registeredEventsRef.current.add(evt);
    }

    return connection;
  }

  useEffect(() => {
    let cancelled = false;

    async function syncConnection() {
      if (token) {
        const state = connectionRef.current?.state;
        if (
          state === signalR.HubConnectionState.Connected ||
          state === signalR.HubConnectionState.Connecting ||
          state === signalR.HubConnectionState.Reconnecting
        ) {
          return;
        }

        const connection = buildConnection();
        connectionRef.current = connection;

        try {
          await connection.start();
        } catch (err) {
          if (!cancelled) console.error("SignalR connection error:", err);
          if (connectionRef.current === connection) connectionRef.current = null;
        }
      } else {
        const conn = connectionRef.current;
        connectionRef.current = null;
        registeredEventsRef.current = new Set();
        if (conn) await conn.stop();
      }
    }

    void syncConnection();

    return () => {
      cancelled = true;
    };
  }, [token, hubUrl]);

  useEffect(() => {
    return () => {
      const conn = connectionRef.current;
      connectionRef.current = null;
      void conn?.stop();
    };
  }, []);

  const subscribe = useCallback(<T,>(event: string, handler: (payload: T) => void): (() => void) => {
    const typedHandler = handler as GenericHandler;

    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(typedHandler);

    if (connectionRef.current && !registeredEventsRef.current.has(event)) {
      const evt = event;
      connectionRef.current.on(evt, (payload: unknown) => {
        listenersRef.current.get(evt)?.forEach((h) => h(payload));
      });
      registeredEventsRef.current.add(event);
    }

    return () => {
      listenersRef.current.get(event)?.delete(typedHandler);
    };
  }, []);

  return <SignalRContext.Provider value={{ subscribe }}>{children}</SignalRContext.Provider>;
}

export function useSignalR() {
  return useContext(SignalRContext);
}
