// src/services/financialDocumentDetector.ts

// Define regex patterns at module level
const DATE_REGEX = /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/;
const AMOUNT_REGEX =
  /(?:KES|Ksh|UGX|TZS|RWF|₦|GHS|R|ZAR|\$)?\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/i;

export type DocumentType =
  | "mpesa"
  | "bank_statement"
  | "csv_export"
  | "invoice"
  | "resume"
  | "image"
  | "empty"
  | "unsupported";

export interface DocumentAnalysis {
  type: DocumentType;
  confidence: number;
  transactionCount: number;
  qualityScore: number;
  hasDates: boolean;
  hasAmounts: boolean;
  hasDescriptions: boolean;
  missingFields: string[];
  warnings: string[];
}

// M-PESA specific keywords
const MPESA_KEYWORDS = [
  "M-PESA",
  "Safaricom",
  "Transaction Cost",
  "Pay Bill",
  "Till Number",
  "Receipt No",
  "Withdraw",
  "Sent to",
  "Received from",
  "Balance",
  "Completed",
];

// Bank statement keywords
const BANK_KEYWORDS = [
  "Account Number",
  "Statement Period",
  "Debit",
  "Credit",
  "Opening Balance",
  "Closing Balance",
  "Branch",
  "Sort Code",
  "IBAN",
  "Transaction Date",
  "Value Date",
];

// Non-statement detection
const RESUME_KEYWORDS = [
  "experience",
  "education",
  "skills",
  "references",
  "curriculum vitae",
  "work history",
];
const INVOICE_KEYWORDS = [
  "invoice",
  "due date",
  "payment terms",
  "bill to",
  "tax invoice",
  "subtotal",
];

const scoreKeywords = (text: string, keywords: string[]): number => {
  const lowerText = text.toLowerCase();
  const matches = keywords.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  ).length;
  return (matches / keywords.length) * 100;
};

const detectTransactionStructure = (text: string) => ({
  hasDates: DATE_REGEX.test(text),
  hasAmounts: AMOUNT_REGEX.test(text),
  hasDescriptions: /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/.test(text),
});

const calculateQualityScore = (
  hasDates: boolean,
  hasAmounts: boolean,
  hasDescriptions: boolean,
  transactionCount: number
): number => {
  let score = 0;
  if (hasDates) score += 30;
  if (hasAmounts) score += 30;
  if (hasDescriptions) score += 30;
  if (transactionCount > 10) score += 10;
  else if (transactionCount > 0) score += 5;
  return Math.min(100, score);
};

export class FinancialDocumentDetector {
  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    let text = "";

    // Check for image files first
    if (file.type.startsWith("image/")) {
      return {
        type: "image",
        confidence: 95,
        transactionCount: 0,
        qualityScore: 0,
        hasDates: false,
        hasAmounts: false,
        hasDescriptions: false,
        missingFields: ["transaction dates", "amounts", "descriptions"],
        warnings: [
          "Screenshots and images are not supported. Please upload the original PDF or CSV statement.",
        ],
      };
    }

    try {
      text = await this.readAsText(file);
    } catch {
      return {
        type: "unsupported",
        confidence: 0,
        transactionCount: 0,
        qualityScore: 0,
        hasDates: false,
        hasAmounts: false,
        hasDescriptions: false,
        missingFields: ["readable content"],
        warnings: ["Could not read file content. The file may be corrupted."],
      };
    }

    // Check for empty content
    if (!text || text.trim().length < 50) {
      return {
        type: "empty",
        confidence: 90,
        transactionCount: 0,
        qualityScore: 0,
        hasDates: false,
        hasAmounts: false,
        hasDescriptions: false,
        missingFields: ["transaction data"],
        warnings: ["No readable content found in this document."],
      };
    }

    // Detect non-statement documents
    const resumeScore = scoreKeywords(text, RESUME_KEYWORDS);
    const invoiceScore = scoreKeywords(text, INVOICE_KEYWORDS);

    if (resumeScore > 40) {
      return {
        type: "resume",
        confidence: resumeScore,
        transactionCount: 0,
        qualityScore: 0,
        hasDates: false,
        hasAmounts: false,
        hasDescriptions: false,
        missingFields: ["transactions", "financial data"],
        warnings: [
          "This appears to be a résumé or CV, not a financial statement.",
        ],
      };
    }

    if (invoiceScore > 40) {
      return {
        type: "invoice",
        confidence: invoiceScore,
        transactionCount: 0,
        qualityScore: 0,
        hasDates: true,
        hasAmounts: true,
        hasDescriptions: true,
        missingFields: ["transaction history"],
        warnings: [
          "This appears to be an invoice rather than a transaction statement.",
        ],
      };
    }

    // Score financial document types
    const mpesaScore = scoreKeywords(text, MPESA_KEYWORDS);
    const bankScore = scoreKeywords(text, BANK_KEYWORDS);
    const structure = detectTransactionStructure(text);

    let type: DocumentType = "unsupported";
    let confidence = Math.max(mpesaScore, bankScore);

    if (mpesaScore > 50) {
      type = "mpesa";
    } else if (bankScore > 50) {
      type = "bank_statement";
    } else if (
      structure.hasDates &&
      structure.hasAmounts &&
      text.includes(",")
    ) {
      type = "csv_export";
      confidence = 60;
    }

    // Calculate transaction count
    const transactionLines = text
      .split("\n")
      .filter((line) => DATE_REGEX.test(line) || AMOUNT_REGEX.test(line));

    const qualityScore = calculateQualityScore(
      structure.hasDates,
      structure.hasAmounts,
      structure.hasDescriptions,
      transactionLines.length
    );

    const missingFields: string[] = [];
    if (!structure.hasDates) missingFields.push("transaction dates");
    if (!structure.hasAmounts) missingFields.push("amounts");
    if (!structure.hasDescriptions) missingFields.push("descriptions");
    if (transactionLines.length === 0) missingFields.push("transactions");

    const warnings: string[] = [];
    if (text.length > 1_000_000)
      warnings.push("Large file detected - processing may be slower");
    if (qualityScore < 50)
      warnings.push(
        "Statement quality is low. Some transactions may be incomplete."
      );

    return {
      type,
      confidence: Math.min(95, Math.max(0, confidence)),
      transactionCount: transactionLines.length,
      qualityScore,
      hasDates: structure.hasDates,
      hasAmounts: structure.hasAmounts,
      hasDescriptions: structure.hasDescriptions,
      missingFields,
      warnings,
    };
  }

  private async readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}

export const documentDetector = new FinancialDocumentDetector();
