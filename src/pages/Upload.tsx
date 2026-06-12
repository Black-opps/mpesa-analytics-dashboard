// src/pages/Upload.tsx
import React from "react";
import { StatementUpload } from "../components/upload/StatementUpload";
import { Sidebar } from "../components/layout/Sidebar";

const Upload: React.FC = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "32px", overflow: "auto" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              color: "white",
              marginBottom: "32px",
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            Upload Statement
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
            Upload your M-PESA statement, bank statement, or SACCO export to
            automatically parse transactions
          </p>
          <StatementUpload />
        </div>
      </div>
    </div>
  );
};

export default Upload;
