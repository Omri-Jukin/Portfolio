import { RegularLayoutContainer } from "./RegularLayout.style";

export default function RegularLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegularLayoutContainer>{children}</RegularLayoutContainer>;
}
