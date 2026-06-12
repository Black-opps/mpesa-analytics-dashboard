// src/utils/magicBytes.ts

// Known file signatures (magic bytes)
const MAGIC_BYTES: Record<
  string,
  { bytes: number[]; extension: string; mime: string }
> = {
  pdf: {
    bytes: [0x25, 0x50, 0x44, 0x46], // %PDF
    extension: "pdf",
    mime: "application/pdf",
  },
  zip: {
    bytes: [0x50, 0x4b, 0x03, 0x04], // PK
    extension: "zip",
    mime: "application/zip",
  },
  xlsx: {
    bytes: [0x50, 0x4b, 0x03, 0x04], // PK (same as zip)
    extension: "xlsx",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  elf: {
    bytes: [0x7f, 0x45, 0x4c, 0x46], // ELF executable
    extension: "",
    mime: "application/x-executable",
  },
  png: {
    bytes: [0x89, 0x50, 0x4e, 0x47],
    extension: "png",
    mime: "image/png",
  },
  jpeg: {
    bytes: [0xff, 0xd8, 0xff],
    extension: "jpg",
    mime: "image/jpeg",
  },
};

export interface MagicByteResult {
  valid: boolean;
  detectedType: string;
  warning?: string;
  confidence: number;
}

/**
 * Validate file using magic bytes (file signatures)
 */
export const validateMagicBytes = async (
  file: File
): Promise<MagicByteResult> => {
  // Read first 8 bytes
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check against known signatures
  for (const [type, signature] of Object.entries(MAGIC_BYTES)) {
    let match = true;
    for (let i = 0; i < signature.bytes.length; i++) {
      if (bytes[i] !== signature.bytes[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      // Check for executable files (dangerous)
      if (type === "elf") {
        return {
          valid: false,
          detectedType: "executable",
          warning: "Executable files are not allowed for security reasons",
          confidence: 100,
        };
      }

      // Check if extension matches
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (signature.extension && fileExt !== signature.extension) {
        return {
          valid: true,
          detectedType: type,
          warning: `File content appears to be ${type.toUpperCase()} but has .${fileExt} extension`,
          confidence: 80,
        };
      }

      return {
        valid: true,
        detectedType: type,
        confidence: 100,
      };
    }
  }

  // For text/CSV files (no magic bytes)
  if (file.type === "text/csv" || file.name.endsWith(".csv")) {
    return {
      valid: true,
      detectedType: "csv",
      confidence: 95,
    };
  }

  return {
    valid: false,
    detectedType: "unknown",
    warning:
      "Unable to determine file type. Please upload PDF, CSV, or Excel files.",
    confidence: 0,
  };
};

/**
 * Check for spoofed MIME types
 */
export const detectMimeSpoofing = (file: File, magicType: string): boolean => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  // Check mismatches
  if (magicType === "pdf" && extension !== "pdf") return true;
  if (magicType === "xlsx" && !["xlsx", "xls"].includes(extension || ""))
    return true;
  if (magicType === "zip" && !["zip", "xlsx", "docx"].includes(extension || ""))
    return true;

  return false;
};
