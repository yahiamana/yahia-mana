import { getCurrentUser } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

/**
 * Admin Layout — Server component that wraps admin pages with sidebar.
 * Auth is handled by middleware, so we just need to get the user info
 * for display. If middleware let us through, we're authenticated.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If no user (login page or edge case), render children without admin shell
  if (!user) {
    return <>{children}</>;
  }

  return (
    <AdminLayoutClient user={{ email: user.email, role: user.role }}>
      {children}
    </AdminLayoutClient>
  );
}
