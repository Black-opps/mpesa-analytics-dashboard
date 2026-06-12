// src/utils/fileHash.ts

/**
 * Compute SHA-256 hash of a file for duplicate detection
 */
export const computeFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

/**
 * Check if a file has been uploaded before
 */
export const checkDuplicateUpload = async (file: File): Promise<boolean> => {
  const hash = await computeFileHash(file);
  const uploadedHashes = JSON.parse(
    localStorage.getItem("uploaded_hashes") || "[]"
  );
  return uploadedHashes.includes(hash);
};

/**
 * Record a successful upload
 */
export const recordUpload = async (file: File): Promise<void> => {
  const hash = await computeFileHash(file);
  const uploadedHashes = JSON.parse(
    localStorage.getItem("uploaded_hashes") || "[]"
  );
  if (!uploadedHashes.includes(hash)) {
    uploadedHashes.push(hash);
    localStorage.setItem("uploaded_hashes", JSON.stringify(uploadedHashes));
  }
};

/**
 * Get upload history with timestamps
 */
export interface UploadRecord {
  hash: string;
  filename: string;
  uploadedAt: string;
  transactionCount?: number;
}

export const getUploadHistory = (): UploadRecord[] => {
  const history = JSON.parse(localStorage.getItem("upload_history") || "[]");
  return history;
};

export const addToUploadHistory = (record: UploadRecord): void => {
  const history = getUploadHistory();
  history.push(record);
  localStorage.setItem("upload_history", JSON.stringify(history.slice(-20))); // Keep last 20
};
