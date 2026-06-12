// src/services/uploadService.ts

import {
  statementValidator,
  ValidationResult,
  ProcessingStage,
} from "./statementValidator";
import { recordUpload, addToUploadHistory } from "../utils/fileHash";
import { assessTransactionQuality } from "../utils/transactionQuality";

export interface UploadProgress {
  stage: "idle" | "validating" | "processing" | "complete" | "error";
  progress: number;
  message: string;
  details?: string;
  stages?: ProcessingStage[];
  validationResult?: ValidationResult;
}

export interface UploadResult {
  success: boolean;
  transactionsAdded?: number;
  fileId?: string;
  qualityScore?: number;
  error?: string;
  validation?: ValidationResult;
}

class UploadService {
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async updateProgress(
    onProgress: (progress: UploadProgress) => void,
    stage: UploadProgress["stage"],
    progress: number,
    message: string,
    details?: string,
    stages?: ProcessingStage[],
    validationResult?: ValidationResult
  ): Promise<void> {
    onProgress({
      stage,
      progress,
      message,
      details,
      stages,
      validationResult,
    });
    await this.delay(300);
  }

  async uploadStatement(
    file: File,
    onProgress: (progress: UploadProgress) => void,
    token: string
  ): Promise<UploadResult> {
    try {
      // Stage 1: File Validation
      await this.updateProgress(
        onProgress,
        "validating",
        5,
        "Checking file...",
        undefined
      );

      const fileValidation = await statementValidator.validateFile(file);
      if (!fileValidation.valid) {
        await this.updateProgress(
          onProgress,
          "error",
          0,
          fileValidation.error || "Invalid file",
          fileValidation.warning
        );
        return { success: false, error: fileValidation.error };
      }

      // Stage 2: Content Validation
      await this.updateProgress(
        onProgress,
        "validating",
        15,
        "Analyzing document structure...",
        undefined
      );
      const contentValidation = await statementValidator.validateContent(file);

      if (!contentValidation.valid) {
        await this.updateProgress(
          onProgress,
          "error",
          20,
          contentValidation.reason || "Document validation failed",
          contentValidation.suggestions?.join(", "),
          undefined,
          contentValidation
        );
        return {
          success: false,
          error: contentValidation.reason,
          validation: contentValidation,
        };
      }

      // Stage 3: Get processing stages
      const stages = statementValidator.getProcessingStages(
        contentValidation.detectedType,
        contentValidation.confidence
      );
      await this.updateProgress(
        onProgress,
        "processing",
        25,
        "Starting upload...",
        undefined,
        stages
      );

      // Stage 4: Actual upload
      const formData = new FormData();
      formData.append("file", file);

      // Simulate stage progress
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const progress = 25 + ((i + 1) / stages.length) * 70;

        stages[i] = { ...stage, status: "processing" };
        await this.updateProgress(
          onProgress,
          "processing",
          progress,
          stage.label,
          undefined,
          [...stages]
        );

        await this.delay(1200);

        stages[i] = { ...stage, status: "completed" };
        await this.updateProgress(
          onProgress,
          "processing",
          progress + 5,
          stage.label,
          undefined,
          [...stages]
        );
      }

      // Actual API call
      const response = await fetch(
        "http://localhost:9000/api/v1/upload/statement",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      // Record successful upload
      await recordUpload(file);
      addToUploadHistory({
        hash: await import("../utils/fileHash").then((m) =>
          m.computeFileHash(file)
        ),
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        transactionCount:
          result.transactions?.length || contentValidation.transactionCount,
      });

      // Assess quality
      const quality = result.transactions
        ? assessTransactionQuality(result.transactions)
        : null;

      await this.updateProgress(
        onProgress,
        "complete",
        100,
        `Analysis complete! ${contentValidation.transactionCount} transactions processed.`,
        quality ? `Quality score: ${quality.score}%` : undefined,
        stages,
        contentValidation
      );

      return {
        success: true,
        transactionsAdded:
          result.transactions?.length || contentValidation.transactionCount,
        fileId: result.file_id,
        qualityScore: quality?.score,
        validation: contentValidation,
      };
    } catch (error) {
      await this.updateProgress(
        onProgress,
        "error",
        0,
        "Upload failed",
        error instanceof Error ? error.message : "Unknown error"
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }
}

export const uploadService = new UploadService();
