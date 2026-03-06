import { prisma } from "@/lib/prisma";

/**
 * Admin Audit Logs Viewer — Shows all admin actions.
 */
export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { admin: { select: { email: true } } },
  });

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "var(--space-2xl)" }}>
        Audit Logs
      </h1>

      <div className="glass" style={{ overflow: "hidden" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.8125rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                Time
              </th>
              <th style={{ padding: "1rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                User
              </th>
              <th style={{ padding: "1rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                Action
              </th>
              <th style={{ padding: "1rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "1rem", color: "var(--color-text-muted)" }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: "1rem" }}>{log.admin.email}</td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      background: "rgba(108, 99, 255, 0.1)",
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                  {log.target || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <p style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
            No audit logs yet.
          </p>
        )}
      </div>
    </div>
  );
}
