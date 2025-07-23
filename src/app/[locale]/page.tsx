"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import ScrollingSections from "~/ScrollingSections";
import ResponsiveBackground from "~/ScrollingSections/ResponsiveBackground";

export default function HomePage() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [locale]);

  if (!mounted) {
    return null;
  }

  return (
    <ResponsiveBackground>
      <ScrollingSections locale={locale} />
    </ResponsiveBackground>
  );
}
