"use client";

import { useState, useEffect } from "react";
import GlassCard from "@/components/GlassCard";
import { getCsrfToken } from "@/lib/csrf-client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(id: string, currentRead: boolean) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken() || "",
        },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, read: !currentRead } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read: !currentRead });
        }
      }
    } catch (err) {
      console.error("Failed to toggle read status:", err);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { 
        method: "DELETE",
        headers: { 
          "x-csrf-token": getCsrfToken() || "",
        },
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: selectedMessage ? "400px 1fr" : "1fr", gap: "2rem", transition: "all 0.3s ease" }}>
      
      {/* List Column */}
      <div>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
            Message <span className="gradient-text">Center</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.875rem" }}>
            {messages.filter(m => !m.read).length} unread inquiries
          </p>
        </header>

        <div style={{ display: "grid", gap: "1rem" }}>
          {loading ? (
            <p style={{ color: "#94A3B8" }}>Loading messages...</p>
          ) : messages.length === 0 ? (
            <GlassCard className="p-8 text-center" style={{ color: "#94A3B8" }}>
              No messages found.
            </GlassCard>
          ) : (
            messages.map((msg) => (
              <GlassCard 
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                style={{ 
                  padding: "1.25rem",
                  cursor: "pointer",
                  border: selectedMessage?.id === msg.id 
                    ? "1px solid #3B82F6" 
                    : "1px solid rgba(255, 255, 255, 0.05)",
                  background: msg.read ? "transparent" : "rgba(59, 130, 246, 0.05)",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: msg.read ? "#94A3B8" : "#F9FAFB" }}>
                    {msg.name}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {msg.subject || "(No Subject)"}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>

      {/* Reader Column */}
      {selectedMessage && (
        <div style={{ animation: "fadeInRight 0.3s ease-out" }}>
          <GlassCard className="p-8" style={{ position: "sticky", top: "2rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>{selectedMessage.subject || "No Subject"}</h2>
                <p style={{ fontSize: "0.9rem", color: "#3B82F6" }}>{selectedMessage.email}</p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  onClick={() => toggleRead(selectedMessage.id, selectedMessage.read)}
                  className="btn btn-secondary" 
                  style={{ fontSize: "0.75rem", padding: "0.5rem 1rem", borderRadius: "8px" }}
                >
                  {selectedMessage.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button 
                  onClick={() => deleteMessage(selectedMessage.id)}
                  style={{ 
                    background: "rgba(239, 68, 68, 0.1)", 
                    border: "1px solid rgba(239, 68, 68, 0.2)", 
                    color: "#EF4444",
                    fontSize: "0.75rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: "1.25rem" }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ 
              background: "rgba(11, 15, 26, 0.5)", 
              padding: "2rem", 
              borderRadius: "12px", 
              lineHeight: 1.8, 
              color: "#F9FAFB",
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
              minHeight: "300px",
              border: "1px solid rgba(255, 255, 255, 0.03)"
            }}>
              {selectedMessage.message}
            </div>
            
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Received via Website Contact Form</span>
              <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Inquiry'}`} className="btn btn-primary" style={{ fontSize: "0.75rem", padding: "0.75rem 1.5rem", borderRadius: "100px" }}>Reply via Email</a>
            </div>
          </GlassCard>
        </div>
      )}

    </div>
  );
}
