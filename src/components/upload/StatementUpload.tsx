// src/components/upload/StatementUpload.tsx

import React, { useRef, useState } from "react";
import { dashboardService } from "../../services/dashboard.service";
import { Card } from "../ui/Card";

export const StatementUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedExtensions = [".csv", ".xlsx", ".xls", ".pdf"];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelection = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setSuccess(null);
    setError(null);

    // Reset password state for new file
    setPassword("");

    // Check if it's a PDF (might need password)
    const isPdf = selectedFile.name.toLowerCase().endsWith(".pdf");
    setIsPasswordProtected(isPdf);

    // Auto-detect if PDF is encrypted (optional: check file header)
    if (isPdf) {
      checkIfPdfIsEncrypted(selectedFile);
    }
  };

  // Optional: Check if PDF is encrypted by reading first bytes
  const checkIfPdfIsEncrypted = async (file: File) => {
    try {
      const arrayBuffer = await file.slice(0, 1024).arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder().decode(uint8Array);

      // Look for encryption indicators in PDF header
      if (text.includes("/Encrypt") || text.includes("/Encryption")) {
        console.log("PDF appears to be encrypted");
        // You could auto-show the password field here
      }
    } catch (err) {
      console.error("Failed to check PDF encryption:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress(0);

      // Fake progress animation for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      // Pass password if it's a PDF and password was provided
      const res = await dashboardService.uploadStatement(
        file,
        isPasswordProtected ? password : undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("Upload response:", res);

      setSuccess(
        "Statement uploaded successfully. Financial intelligence pipeline started."
      );

      setTimeout(() => {
        setUploadProgress(0);
      }, 1200);
    } catch (err) {
      console.error(err);

      // Handle specific error for wrong password
      if (err instanceof Error && err.message.includes("password")) {
        setError(
          "Failed to decrypt PDF. Please check your password and try again."
        );
      } else {
        setError("Upload failed. Please verify the file format and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Header */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Upload Financial Statement
          </h2>

          <p
            style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#94a3b8",
              lineHeight: 1.5,
            }}
          >
            Upload M-PESA CSV, Excel, or PDF statements for parsing,
            normalization, reconciliation, and intelligence generation.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);

            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
              handleFileSelection(droppedFile);
            }
          }}
          style={{
            position: "relative",
            border: dragging
              ? "2px solid #3CE6AE"
              : "2px dashed rgba(148,163,184,0.25)",
            background: dragging
              ? "rgba(60,230,174,0.08)"
              : "linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,1) 100%)",
            borderRadius: "20px",
            padding: "40px 24px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            overflow: "hidden",
          }}
        >
          {/* Glow Effect */}
          <div
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              background: "rgba(60,230,174,0.08)",
              filter: "blur(90px)",
              top: "-80px",
              right: "-60px",
              borderRadius: "50%",
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelection(e.target.files?.[0] || null)}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "14px",
            }}
          >
            {/* Upload Icon */}
            <div
              style={{
                width: "74px",
                height: "74px",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(60,230,174,0.18) 0%, rgba(34,197,94,0.18) 100%)",
                border: "1px solid rgba(60,230,174,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
              }}
            >
              ⬆
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Drag & Drop Statement
              </h3>

              <p
                style={{
                  marginTop: "8px",
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                or click to browse files
              </p>
            </div>

            {/* Supported Files */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {allowedExtensions.map((ext) => (
                <div
                  key={ext}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "11px",
                    color: "#cbd5e1",
                    fontWeight: 600,
                  }}
                >
                  {ext.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected File Section */}
        {file && (
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "rgba(15,23,42,0.75)",
              border: "1px solid rgba(148,163,184,0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* File Info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background:
                      "linear-gradient(135deg, rgba(60,230,174,0.15) 0%, rgba(34,197,94,0.15) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  {file.name.toLowerCase().endsWith(".pdf") ? "📕" : "📄"}
                </div>

                <div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {file.name}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      color: "#94a3b8",
                      fontSize: "12px",
                    }}
                  >
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setPassword("");
                  setIsPasswordProtected(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Password Input for PDFs */}
            {isPasswordProtected && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(60,230,174,0.05)",
                  border: "1px solid rgba(60,230,174,0.15)",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#3CE6AE",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  🔐 PDF Password (if encrypted)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    fontSize: "13px",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3CE6AE";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(60,230,174,0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#94a3b8",
                  }}
                >
                  ⓘ Only required if your PDF statement is password-protected
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              <span>
                {isPasswordProtected && password
                  ? "Decrypting and processing..."
                  : "Processing financial statement..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #3CE6AE 0%, #22C55E 100%)",
                  borderRadius: "999px",
                  transition: "width 0.25s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Status Messages */}
        {success && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.18)",
              color: "#4ADE80",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            ✓ {success}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "#F87171",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={
            !file || loading || (isPasswordProtected && !password.trim())
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            cursor:
              !file || loading || (isPasswordProtected && !password.trim())
                ? "not-allowed"
                : "pointer",
            opacity:
              !file || loading || (isPasswordProtected && !password.trim())
                ? 0.6
                : 1,
            background: "linear-gradient(135deg, #3CE6AE 0%, #22C55E 100%)",
            color: "#052e16",
            fontWeight: 700,
            fontSize: "14px",
            transition: "all 0.2s ease",
            boxShadow: "0 10px 30px rgba(34,197,94,0.18)",
          }}
        >
          {loading
            ? "Processing Statement..."
            : isPasswordProtected && !password.trim()
            ? "Enter Password to Continue"
            : "Upload & Analyze Statement"}
        </button>
      </div>
    </Card>
  );
};
