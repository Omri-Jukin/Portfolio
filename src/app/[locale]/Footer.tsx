"use client";

import { Footer as FooterComponent } from "~/Footer";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const links = t.raw("links");
  const social = t.raw("social");
  return (
    <FooterComponent
      title={t("title")}
      linksTitle={t("linksTitle")}
      socialTitle={t("socialTitle")}
      emailTitle={t("emailTitle")}
      email={t("email")}
      copyright={t("copyright")}
      links={links}
      social={social}
    >
      {t("children")}
    </FooterComponent>
  );
}
