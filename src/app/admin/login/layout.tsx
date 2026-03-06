/**
 * Admin Login Layout — completely separate from the authenticated admin layout.
 * This page has no auth check so users can actually reach it.
 */
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
