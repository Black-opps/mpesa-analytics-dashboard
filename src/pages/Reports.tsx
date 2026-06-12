// src/pages/Reports.tsx
import React, { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { colors } from "../design/colors";
import { dashboardService } from "../services/dashboard.service";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<
    "summary" | "detailed" | "category"
  >("summary");
  const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">(
    "month"
  );
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const isPro = user?.role === "owner" || user?.role === "admin";

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const stats = await dashboardService.getSummary();
      const transactions = await dashboardService.getTransactions(500);
      const categories = await dashboardService.getSpendingCategories();

      setReportData({
        summary: stats,
        transactions: transactions,
        categories: categories,
        generatedAt: new Date().toISOString(),
        dateRange: dateRange,
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    const headers = [
      "Date",
      "Amount",
      "Type",
      "Counterparty",
      "Description",
      "Reference",
    ];
    const rows = reportData.transactions.map((t: any) => [
      new Date(t.date).toLocaleDateString(),
      t.amount,
      t.type,
      t.counterparty,
      t.description || "",
      t.reference || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    alert("PDF export will be available in Pro version");
  };

  const handleUpload = () => navigate("/upload");
  const handleUpgrade = () => alert("Upgrade to Pro - Coming soon");

  return (
    <AppShell
      sidebar={<Sidebar isPro={isPro} />}
      topbar={
        <Topbar
          onUpload={handleUpload}
          isPro={isPro}
          onUpgrade={handleUpgrade}
        />
      }
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              color: colors.text.primary,
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            📄 Reports & Export
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Generate financial reports and export your data
          </p>
        </div>

        <Card style={{ marginBottom: "24px", padding: "24px" }}>
          <h3 style={{ color: colors.text.primary, marginBottom: "20px" }}>
            Report Settings
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                color: colors.text.secondary,
                display: "block",
                marginBottom: "8px",
              }}
            >
              Report Type
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["summary", "detailed", "category"].map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type as any)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background:
                      reportType === type
                        ? colors.status.success
                        : colors.cardLight,
                    border: `1px solid ${
                      reportType === type
                        ? colors.status.success
                        : colors.border
                    }`,
                    color:
                      reportType === type ? "#1a1a2e" : colors.text.primary,
                    cursor: "pointer",
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                color: colors.text.secondary,
                display: "block",
                marginBottom: "8px",
              }}
            >
              Date Range
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["month", "quarter", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range as any)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background:
                      dateRange === range
                        ? colors.status.success
                        : colors.cardLight,
                    border: `1px solid ${
                      dateRange === range
                        ? colors.status.success
                        : colors.border
                    }`,
                    color:
                      dateRange === range ? "#1a1a2e" : colors.text.primary,
                    cursor: "pointer",
                  }}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              background: colors.status.success,
              border: "none",
              color: "#1a1a2e",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </Card>

        {reportData && (
          <Card style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <h3 style={{ color: colors.text.primary }}>
                Financial Summary Report
              </h3>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: colors.cardLight,
                    border: `1px solid ${colors.border}`,
                    color: colors.text.primary,
                    cursor: "pointer",
                  }}
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={!isPro}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: isPro
                      ? colors.status.success
                      : colors.cardLight,
                    border: `1px solid ${colors.border}`,
                    color: isPro ? "#1a1a2e" : colors.text.secondary,
                    cursor: isPro ? "pointer" : "not-allowed",
                    opacity: isPro ? 1 : 0.5,
                  }}
                >
                  📄 Export PDF {!isPro && "(Pro)"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: colors.cardLight,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: colors.status.success,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES {reportData.summary.money_in.toLocaleString()}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: "12px" }}>
                  Total Income
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: colors.cardLight,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: colors.status.danger,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES {reportData.summary.money_out.toLocaleString()}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: "12px" }}>
                  Total Expenses
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  background: colors.cardLight,
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    color: colors.text.primary,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  KES {reportData.summary.net_flow.toLocaleString()}
                </div>
                <div style={{ color: colors.text.secondary, fontSize: "12px" }}>
                  Net Flow
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                background: colors.cardLight,
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{ color: colors.text.primary, fontWeight: "bold" }}
                >
                  Financial Health Score
                </span>
                <span
                  style={{ color: colors.status.success, fontWeight: "bold" }}
                >
                  {reportData.summary.financial_health_score}/100
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: colors.border,
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${reportData.summary.financial_health_score}%`,
                    height: "100%",
                    background: colors.status.success,
                  }}
                />
              </div>
              <p
                style={{
                  color: colors.text.secondary,
                  fontSize: "13px",
                  marginTop: "12px",
                }}
              >
                Generated on {new Date(reportData.generatedAt).toLocaleString()}
              </p>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
};
