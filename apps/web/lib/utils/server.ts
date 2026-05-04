import { cacheLife } from "next/cache";

export function runtimeCacheLife(profile: string | Parameters<typeof cacheLife>[0]) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return cacheLife("none");
  } else {
    return cacheLife(profile as Parameters<typeof cacheLife>[0]);
  }
}

export async function runtimeGet<T>(callback: () => Promise<T>, fallback: T) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return fallback;
  } else {
    return await callback();
  }
}
