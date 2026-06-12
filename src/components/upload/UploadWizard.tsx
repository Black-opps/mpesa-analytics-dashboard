// src/components/upload/UploadWizard.tsx

import React, { useState, useCallback } from "react";
import {
  statementValidator,
  ProcessingStage,
  ValidationResult,
} from "../../services/statementValidator";
import { uploadService } from "../../services/uploadService";
import "./UploadWizard.css";

interface UploadWizardProps {
  token: string;
  onUploadComplete: (result: any) => void;
  onClose: () => void;
}

const UploadWizard: React.FC<UploadWizardProps> = ({
  token,
  onUploadComplete,
  onClose,
}) => {
  const [stage, setStage] = useState<
    "idle" | "validating" | "processing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>(
    []
  );
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorSuggestions, setErrorSuggestions] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // 🆕 Password state for protected PDFs
  const [pdfPassword, setPdfPassword] = useState<string>("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Check if it's a PDF - ask for password
      if (file.name.toLowerCase().endsWith(".pdf")) {
        setSelectedFile(file);
        setShowPasswordInput(true);
      } else {
        processFile(file, "");
      }
    }
  }, []);

  const processFile = async (file: File, password: string) => {
    setSelectedFile(file);
    setStage("validating");
    setProgress(5);
    setShowPasswordInput(false);

    try {
      // Step 1: Validate file (size, type, duplicate)
      const fileValidation = await statementValidator.validateFile(file);
      if (!fileValidation.valid) {
        setErrorMessage(fileValidation.error || "Invalid file");
        setErrorSuggestions([]);
        setStage("error");
        return;
      }

      // Step 2: Validate content (document type, transaction structure)
      setProgress(15);
      const contentValidation = await statementValidator.validateContent(file);
      setValidationResult(contentValidation);

      if (!contentValidation.valid) {
        setErrorMessage(
          contentValidation.reason || "Could not process document"
        );
        setErrorSuggestions(contentValidation.suggestions || []);
        setStage("error");
        return;
      }

      // Step 3: Get processing stages based on detected document type
      const stages = statementValidator.getProcessingStages(
        contentValidation.detectedType,
        contentValidation.confidence
      );
      setProcessingStages(stages);
      setStage("processing");
      setCurrentStageIndex(0);

      // Step 4: Process each stage with animation
      for (let i = 0; i < stages.length; i++) {
        setCurrentStageIndex(i);
        setProcessingStages((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "processing" } : s))
        );

        const stageProgress = 20 + ((i + 1) / stages.length) * 70;
        setProgress(stageProgress);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        setProcessingStages((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "completed" } : s))
        );
      }

      // Step 5: Actual upload to backend with password if provided
      const formData = new FormData();
      formData.append("file", file);
      if (password) {
        formData.append("password", password);
      }

      const response = await fetch(
        "http://localhost:9000/api/v1/upload/statement",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 && errorData.detail?.includes("password")) {
          setErrorMessage("Incorrect password. Please try again.");
          setShowPasswordInput(true);
          setStage("idle");
          return;
        }
        throw new Error(
          errorData.detail || `Upload failed: ${response.status}`
        );
      }

      const result = await response.json();
      setProgress(100);
      setStage("complete");

      setTimeout(() => onUploadComplete(result), 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setErrorSuggestions([
        "Check your internet connection",
        "Try a smaller file",
        "For password-protected PDFs, make sure the password is correct",
        "Contact support if issue persists",
      ]);
      setStage("error");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith(".pdf")) {
        setSelectedFile(file);
        setShowPasswordInput(true);
      } else {
        processFile(file, "");
      }
    }
  };

  // Password Input State (for protected PDFs)
  if (showPasswordInput && selectedFile) {
    return (
      <div className="upload-overlay" onClick={onClose}>
        <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>

          <div className="password-input-container">
            <div className="password-icon">🔒</div>
            <h3>Password Protected PDF</h3>
            <p>
              This PDF is password protected. Please enter the password to
              continue.
              <br />
              <small>
                The password was sent to your phone via SMS when you requested
                the statement.
              </small>
            </p>

            <input
              type="password"
              className="password-input"
              placeholder="Enter PDF password"
              value={pdfPassword}
              onChange={(e) => setPdfPassword(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && processFile(selectedFile, pdfPassword)
              }
              autoFocus
            />

            <div className="password-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowPasswordInput(false);
                  setSelectedFile(null);
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={() => processFile(selectedFile, pdfPassword)}
                disabled={!pdfPassword.trim()}
              >
                Process PDF →
              </button>
            </div>

            <div className="password-tip">
              <span>💡</span>
              <span>
                If you don't have the password, download the statement again
                from M-PESA app or request a new one.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Idle State - Dropzone (same as before)
  if (stage === "idle") {
    return (
      <div className="upload-overlay" onClick={onClose}>
        <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>

          <div
            className={`dropzone ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="dropzone-icon">📄</div>
            <h3>Upload Financial Statement</h3>
            <p>
              Drag & drop your M-PESA statement, bank statement, or CSV export
            </p>

            <div className="or-divider">or</div>

            <label className="browse-btn">
              Browse files
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={handleFileSelect}
                hidden
              />
            </label>

            <div className="supported-info">
              <div className="info-icon">📌</div>
              <div className="info-text">
                <strong>Supported formats:</strong> M-PESA PDF, CSV exports,
                Excel statements, Bank PDFs
              </div>
            </div>

            <div className="tips">
              <span>🔒 Bank-level encryption</span>
              <span>⚡ Instant analysis</span>
              <span>🧠 AI-powered insights</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validating State (same as before)
  if (stage === "validating") {
    return (
      <div className="upload-overlay">
        <div className="upload-modal processing">
          <div className="processing-animation">
            <div className="pulse-ring"></div>
            <div className="processing-icon">🔍</div>
          </div>
          <h3>Analyzing your document</h3>
          <p className="processing-message">
            Checking file format and transaction structure...
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">{Math.round(progress)}% complete</div>
          <div className="tip">
            <span>💡</span>
            <span>
              We support M-PESA statements, bank statements, and CSV exports
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Processing State (same as before)
  if (stage === "processing") {
    const currentStage = processingStages[currentStageIndex];

    return (
      <div className="upload-overlay">
        <div className="upload-modal processing">
          <div className="processing-header">
            <div className="processing-animation">
              <div className="pulse-ring"></div>
              <div className="processing-icon">
                {currentStage?.id === "uploading" && "📤"}
                {currentStage?.id === "validating" && "🔍"}
                {currentStage?.id === "parsing" && "📄"}
                {currentStage?.id === "categorizing" && "🏷️"}
                {currentStage?.id === "detecting" && "🔍"}
                {currentStage?.id === "building" && "🧠"}
              </div>
            </div>
            <h3>{currentStage?.label || "Processing..."}</h3>
            {currentStage?.message && (
              <p className="processing-subtitle">{currentStage.message}</p>
            )}
          </div>

          <div className="processing-stages-list">
            {processingStages.map((stage, idx) => (
              <div key={stage.id} className={`stage-item ${stage.status}`}>
                <div className="stage-icon">
                  {stage.status === "completed" && "✓"}
                  {stage.status === "processing" && "⟳"}
                  {stage.status === "pending" && "○"}
                </div>
                <div className="stage-info">
                  <div className="stage-label">{stage.label}</div>
                  {stage.message && stage.status === "completed" && (
                    <div className="stage-message">{stage.message}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">{Math.round(progress)}% complete</div>

          <div className="tip">
            <span>✨</span>
            <span>
              {validationResult?.detectedType === "mpesa" &&
                "M-PESA statement detected — optimizing for mobile money patterns"}
              {validationResult?.detectedType === "bank_statement" &&
                "Bank statement detected — analyzing transaction structure"}
              {validationResult?.detectedType === "csv_export" &&
                "CSV export detected — processing transactions"}
              {!validationResult &&
                "First time uploading? We'll guide you through it"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Complete State (same as before)
  if (stage === "complete") {
    return (
      <div className="upload-overlay">
        <div className="upload-modal complete">
          <div className="checkmark">✓</div>
          <h3>Analysis Complete! 🎉</h3>
          <p>
            {validationResult?.transactionCount
              ? `${validationResult.transactionCount} transactions processed successfully`
              : "Your financial intelligence is ready"}
          </p>
          {validationResult?.qualityScore && (
            <div className="quality-badge">
              Quality Score: {validationResult.qualityScore}%
            </div>
          )}
          <div className="completion-stats">
            <div className="stat">
              <span className="stat-value">✓</span>
              <span className="stat-label">Validated</span>
            </div>
            <div className="stat">
              <span className="stat-value">✓</span>
              <span className="stat-label">Parsed</span>
            </div>
            <div className="stat">
              <span className="stat-value">✓</span>
              <span className="stat-label">Analyzed</span>
            </div>
          </div>
          <button className="view-btn" onClick={onUploadComplete}>
            View Intelligence Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="upload-overlay">
      <div className="upload-modal error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Process Document</h3>
        <p className="error-message">{errorMessage}</p>

        {validationResult && (
          <div className="error-details">
            <div className="detected-type">
              Detected: {validationResult.detectedType}
              <span className="confidence">
                ({validationResult.confidence}% confidence)
              </span>
            </div>
            {validationResult.missingFields.length > 0 && (
              <div className="missing-fields">
                Missing: {validationResult.missingFields.join(", ")}
              </div>
            )}
          </div>
        )}

        {errorSuggestions.length > 0 && (
          <div className="suggestions">
            <strong>Suggestions:</strong>
            <ul>
              {errorSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="supported-formats">
          <strong>Supported formats:</strong>
          <div className="format-badges">
            <span className="format-badge">📄 M-PESA PDF</span>
            <span className="format-badge">📊 CSV Export</span>
            <span className="format-badge">📑 Excel Statement</span>
            <span className="format-badge">🏦 Bank Statement</span>
          </div>
        </div>

        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Another File →
        </button>
      </div>
    </div>
  );
};

export default UploadWizard;
