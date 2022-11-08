"use client";

import { NhostNextProvider, NhostClient } from "@nhost/nextjs";

const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN ?? "",
  region: process.env.NEXT_PUBLIC_NHOST_REGION ?? "",
});

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <NhostNextProvider nhost={nhost}>{children}</NhostNextProvider>;
