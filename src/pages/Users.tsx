// src/pages/Users.tsx
import React, { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { colors } from "../design/colors";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api/client";

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const Users: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "user",
  });

  const isAdmin = user?.role === "owner" || user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    loadUsers();
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await api.post("/auth/register", newUser);
      setShowAddModal(false);
      setNewUser({ email: "", full_name: "", password: "", role: "user" });
      loadUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("Failed to add user");
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await api.put(`/admin/users/${userId}`, { role });
      loadUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${userId}`, { is_active: !isActive });
      loadUsers();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleUpload = () => navigate("/upload");
  const handleUpgrade = () => alert("Upgrade to Pro - Coming soon");

  if (!isAdmin) return null;

  if (loading) {
    return (
      <AppShell
        sidebar={<Sidebar isPro={true} />}
        topbar={
          <Topbar
            onUpload={handleUpload}
            isPro={true}
            onUpgrade={handleUpgrade}
          />
        }
      >
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: colors.text.secondary,
          }}
        >
          Loading users...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      sidebar={<Sidebar isPro={true} />}
      topbar={
        <Topbar
          onUpload={handleUpload}
          isPro={true}
          onUpgrade={handleUpgrade}
        />
      }
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                color: colors.text.primary,
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              👥 User Management
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Manage platform users, roles, and permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background: colors.status.success,
              border: "none",
              color: "#1a1a2e",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + Add User
          </button>
        </div>

        <Card style={{ overflowX: "auto", padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${colors.border}`,
                  background: colors.cardLight,
                }}
              >
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: colors.text.secondary,
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: colors.text.secondary,
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: colors.text.secondary,
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: colors.text.secondary,
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    color: colors.text.secondary,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <td style={{ padding: "16px", color: colors.text.primary }}>
                    {u.full_name || "-"}
                  </td>
                  <td style={{ padding: "16px", color: colors.text.primary }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: `1px solid ${colors.border}`,
                        background: colors.cardLight,
                        color: colors.text.primary,
                      }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="analyst">Analyst</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        background: u.is_active
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(239,68,68,0.1)",
                        color: u.is_active
                          ? colors.status.success
                          : colors.status.danger,
                        fontSize: "12px",
                      }}
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <button
                      onClick={() => handleToggleStatus(u.id, u.is_active)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: `1px solid ${colors.border}`,
                        background: colors.cardLight,
                        color: u.is_active
                          ? colors.status.danger
                          : colors.status.success,
                        cursor: "pointer",
                      }}
                    >
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Add User Modal */}
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <Card style={{ maxWidth: "500px", width: "90%", padding: "30px" }}>
              <h2 style={{ color: colors.text.primary, marginBottom: "20px" }}>
                Add New User
              </h2>
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, full_name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardLight,
                  color: colors.text.primary,
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardLight,
                  color: colors.text.primary,
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardLight,
                  color: colors.text.primary,
                }}
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  border: `1px solid ${colors.border}`,
                  background: colors.cardLight,
                  color: colors.text.primary,
                }}
              >
                <option value="viewer">Viewer</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleAddUser}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: colors.status.success,
                    border: "none",
                    borderRadius: "8px",
                    color: "#1a1a2e",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: colors.cardLight,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "8px",
                    color: colors.text.primary,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
};
