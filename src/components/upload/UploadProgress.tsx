// src/components/upload/UploadProgress.tsx

import React from "react";
import { ProcessingStage } from "../../services/statementValidator";
import "./UploadWizard.css";

interface UploadProgressProps {
  stages: ProcessingStage[];
  currentStage: string;
  progress: number;
  message: string;
  details?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  stages,
  currentStage,
  progress,
  message,
  details,
}) => {
  const getStageIcon = (status: string, label: string) => {
    if (status === "completed") return "✓";
    if (status === "processing") return "⟳";
    if (label === currentStage) return "●";
    return "○";
  };

  return (
    <div className="processing-container">
      <div className="processing-stages-list">
        {stages.map((stage, idx) => (
          <div key={stage.id} className={`stage-item ${stage.status}`}>
            <div className="stage-icon">
              {getStageIcon(stage.status, stage.label)}
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

      <div className="progress-section">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">{Math.round(progress)}% complete</div>
      </div>

      <div className="processing-tip">
        <span>💡</span>
        <span>{details || message}</span>
      </div>
    </div>
  );
};
