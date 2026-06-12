// src/utils/transactionQuality.ts

export interface Transaction {
  id: string;
  amount: number;
  type?: "sent" | "received";
  transaction_type?: "sent" | "received";
  counterparty: string;
  date: string;
  description?: string;
  reference?: string;
  category?: string;
}

export interface TransactionQuality {
  score: number;
  issues: string[];
  suggestions: string[];
  details: {
    totalTransactions: number;
    validTransactions: number;
    missingDates: number;
    missingAmounts: number;
    missingDescriptions: number;
    potentialDuplicates: number;
  };
}

/**
 * Assess the quality of parsed transactions
 */
export const assessTransactionQuality = (
  transactions: Transaction[]
): TransactionQuality => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  let missingDates = 0;
  let missingAmounts = 0;
  let missingDescriptions = 0;
  let potentialDuplicates = 0;

  // Check each transaction
  transactions.forEach((transaction) => {
    if (!transaction.date) missingDates++;
    if (!transaction.amount || transaction.amount === 0) missingAmounts++;
    if (!transaction.description && !transaction.counterparty)
      missingDescriptions++;
  });

  // Check for potential duplicates (same counterparty, same amount, within 60 seconds)
  for (let i = 0; i < transactions.length; i++) {
    for (let j = i + 1; j < transactions.length; j++) {
      const t1 = transactions[i];
      const t2 = transactions[j];

      if (
        t1.amount === t2.amount &&
        t1.counterparty === t2.counterparty &&
        t1.type === t2.type
      ) {
        const date1 = new Date(t1.date);
        const date2 = new Date(t2.date);
        const diffMs = Math.abs(date1.getTime() - date2.getTime());

        if (diffMs < 60000) {
          // Within 1 minute
          potentialDuplicates++;
        }
      }
    }
  }

  // Calculate score penalties
  const total = transactions.length;
  if (total > 0) {
    if (missingDates > 0) {
      const penalty = (missingDates / total) * 30;
      score -= penalty;
      issues.push(
        `${missingDates} transaction${
          missingDates !== 1 ? "s are" : " is"
        } missing dates`
      );
    }

    if (missingAmounts > 0) {
      const penalty = (missingAmounts / total) * 30;
      score -= penalty;
      issues.push(
        `${missingAmounts} transaction${
          missingAmounts !== 1 ? "s have" : " has"
        } invalid amounts`
      );
    }

    if (missingDescriptions > 0) {
      const penalty = (missingDescriptions / total) * 20;
      score -= penalty;
      issues.push(
        `${missingDescriptions} transaction${
          missingDescriptions !== 1 ? "s are" : " is"
        } missing descriptions`
      );
    }

    if (potentialDuplicates > 0) {
      const penalty = (potentialDuplicates / total) * 20;
      score -= penalty;
      issues.push(
        `${potentialDuplicates} potential duplicate transaction${
          potentialDuplicates !== 1 ? "s" : ""
        } detected`
      );
    }
  }

  // Generate suggestions
  if (missingDates > 0) {
    suggestions.push("Ensure your statement includes transaction dates");
  }
  if (missingAmounts > 0) {
    suggestions.push(
      "Check if amounts are correctly formatted in the statement"
    );
  }
  if (missingDescriptions > 0) {
    suggestions.push("Download the full statement with descriptions included");
  }
  if (potentialDuplicates > 0) {
    suggestions.push(
      "Review transactions for possible duplicates before analysis"
    );
  }

  if (score >= 90 && suggestions.length === 0) {
    suggestions.push(
      "Your statement quality is excellent! Insights will be highly accurate."
    );
  } else if (score >= 70) {
    suggestions.push(
      "Statement quality is good. Some insights may be less precise."
    );
  } else if (score >= 50) {
    suggestions.push(
      "Consider downloading a fresh statement for better accuracy."
    );
  } else {
    suggestions.push("Statement quality is low. Insights may be incomplete.");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    issues,
    suggestions,
    details: {
      totalTransactions: total,
      validTransactions: total - missingDates - missingAmounts,
      missingDates,
      missingAmounts,
      missingDescriptions,
      potentialDuplicates,
    },
  };
};

/**
 * Get quality color based on score
 */
export const getQualityColor = (score: number): string => {
  if (score >= 90) return "#10b981"; // Green
  if (score >= 70) return "#3b82f6"; // Blue
  if (score >= 50) return "#f59e0b"; // Orange
  return "#ef4444"; // Red
};

/**
 * Get quality label
 */
export const getQualityLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
};
