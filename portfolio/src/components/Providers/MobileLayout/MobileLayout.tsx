import { MobileLayoutContainer } from "./MobileLayout.style";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayoutContainer>{children}</MobileLayoutContainer>;
}
