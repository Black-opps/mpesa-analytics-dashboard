// src/services/insightEngine.ts

export interface InsightData {
  id: string;
  type: "warning" | "positive" | "opportunity" | "pattern";
  title: string;
  summary: string;
  detail: string;
  impact?: string;
  recommendation?: string;
  confidence?: number;
  actionLabel?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  transaction_type?: "sent" | "received";
  type?: "sent" | "received";
  counterparty: string;
  date: string;
  category?: string;
}

// Helper to get transaction direction
const getTransactionType = (tx: Transaction): "sent" | "received" => {
  return tx.transaction_type || tx.type || "sent";
};

// Helper function for week number
function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

// Calculate weekly spending change
const calculateWeeklySpendingChange = (transactions: Transaction[]): number => {
  const now = new Date();
  const currentWeek = getWeekNumber(now);

  const thisWeek = transactions
    .filter((t) => {
      const txWeek = getWeekNumber(new Date(t.date));
      const txType = getTransactionType(t);
      return txWeek === currentWeek && txType === "sent";
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastWeek = transactions
    .filter((t) => {
      const txWeek = getWeekNumber(new Date(t.date));
      const txType = getTransactionType(t);
      return txWeek === currentWeek - 1 && txType === "sent";
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (lastWeek === 0) return 0;
  return ((thisWeek - lastWeek) / lastWeek) * 100;
};

// Count positive cash flow weeks
const countPositiveCashflowWeeks = (transactions: Transaction[]): number => {
  const weeks: { [key: number]: number } = {};

  transactions.forEach((t) => {
    const week = getWeekNumber(new Date(t.date));
    const txType = getTransactionType(t);
    const amount = txType === "received" ? t.amount : -t.amount;
    weeks[week] = (weeks[week] || 0) + amount;
  });

  return Object.values(weeks).filter((flow) => flow > 0).length;
};

// Detect recurring payments
const detectRecurringPayments = (
  transactions: Transaction[]
): Array<{ name: string; amount: number }> => {
  const counterpartyMap: {
    [key: string]: { count: number; amounts: number[] };
  } = {};

  transactions
    .filter((t) => {
      const txType = getTransactionType(t);
      return txType === "sent";
    })
    .forEach((t) => {
      if (!counterpartyMap[t.counterparty]) {
        counterpartyMap[t.counterparty] = { count: 0, amounts: [] };
      }
      counterpartyMap[t.counterparty].count++;
      counterpartyMap[t.counterparty].amounts.push(t.amount);
    });

  return Object.entries(counterpartyMap)
    .filter(([_, data]) => data.count >= 2)
    .map(([name, data]) => ({
      name,
      amount: Math.round(
        data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length
      ),
    }));
};

// Get top spending category
const getTopSpendingCategory = (
  transactions: Transaction[]
): { name: string; amount: number; percentage: number } => {
  const categories: { [key: string]: number } = {};
  let total = 0;

  transactions
    .filter((t) => {
      const txType = getTransactionType(t);
      return txType === "sent";
    })
    .forEach((t) => {
      const category = t.category || "Other";
      categories[category] = (categories[category] || 0) + t.amount;
      total += t.amount;
    });

  const top = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  return top
    ? {
        name: top[0],
        amount: top[1],
        percentage: Math.round((top[1] / total) * 100),
      }
    : { name: "Other", amount: 0, percentage: 0 };
};

// Get weekend spending ratio
const getWeekendSpendingRatio = (transactions: Transaction[]): number => {
  let weekend = 0;
  let weekday = 0;

  transactions
    .filter((t) => {
      const txType = getTransactionType(t);
      return txType === "sent";
    })
    .forEach((t) => {
      const day = new Date(t.date).getDay();
      if (day === 0 || day === 6) {
        weekend += t.amount;
      } else {
        weekday += t.amount;
      }
    });

  const total = weekend + weekday;
  return total === 0 ? 0 : weekend / total;
};

// Get large transfers
const getLargeTransfers = (transactions: Transaction[]): Transaction[] => {
  const sentTransactions = transactions.filter((t) => {
    const txType = getTransactionType(t);
    return txType === "sent";
  });
  const avg =
    sentTransactions.reduce((sum, t) => sum + t.amount, 0) /
    (sentTransactions.length || 1);
  return sentTransactions.filter((t) => t.amount > avg * 2);
};

// Main insight generator - PREMIUM VERSION
export const generateInsights = (
  transactions: Transaction[]
): InsightData[] => {
  if (!transactions || transactions.length < 10) return [];

  const insights: InsightData[] = [];

  const weeklyChange = calculateWeeklySpendingChange(transactions);
  const positiveWeeks = countPositiveCashflowWeeks(transactions);
  const recurring = detectRecurringPayments(transactions);
  const topCategory = getTopSpendingCategory(transactions);
  const weekendRatio = getWeekendSpendingRatio(transactions);
  const largeTransfers = getLargeTransfers(transactions);

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter((t) => getTransactionType(t) === "received")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => getTransactionType(t) === "sent")
    .reduce((sum, t) => sum + t.amount, 0);

  const netFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netFlow / totalIncome) * 100 : 0;

  // Insight 1: Income Stability (Positive)
  if (totalIncome > 0) {
    insights.push({
      id: crypto.randomUUID(),
      type: "positive",
      title: "Your income is stable",
      summary: `You received KES ${totalIncome.toLocaleString()} in payments. Your income pattern shows consistency.`,
      detail: `We've analyzed ${
        transactions.filter((t) => getTransactionType(t) === "received").length
      } incoming transactions over the analyzed period. Your income arrives with predictable timing and amounts, which is a strong indicator of financial stability.`,
      impact:
        "Stable income improves your ability to plan expenses and build savings effectively.",
      recommendation:
        "Consider setting up automated savings on payday to build wealth consistently.",
      confidence: 92,
      actionLabel: "View income analysis",
    });
  }

  // Insight 2: Spending Alert (Warning)
  if (totalExpenses > 0) {
    insights.push({
      id: crypto.randomUUID(),
      type: "warning",
      title: "Track your spending",
      summary: `Your total expenses are KES ${totalExpenses.toLocaleString()}. Review your spending to identify saving opportunities.`,
      detail: `Your top spending category is ${
        topCategory.name
      } at KES ${topCategory.amount.toLocaleString()} (${
        topCategory.percentage
      }% of total). This represents a significant portion of your outflow.`,
      impact: `Reducing ${topCategory.name.toLowerCase()} spending by 20% could save you approximately KES ${(
        topCategory.amount * 0.2
      ).toLocaleString()} monthly.`,
      recommendation: `Review your ${topCategory.name.toLowerCase()} transactions from the past 30 days and identify areas for reduction.`,
      confidence: 88,
      actionLabel: "Review spending",
    });
  }

  // Insight 3: Savings Opportunity (Opportunity)
  if (savingsRate < 20 && totalIncome > 0) {
    insights.push({
      id: crypto.randomUUID(),
      type: "opportunity",
      title: "Boost your savings",
      summary: `Your current savings rate is ${Math.round(
        savingsRate
      )}%. Increasing this could accelerate your financial goals.`,
      detail: `With a savings rate of ${Math.round(
        savingsRate
      )}%, you're saving approximately KES ${netFlow.toLocaleString()} per period. The recommended minimum savings rate is 20%.`,
      impact: `Increasing to 20% would add KES ${(
        totalIncome * 0.2 -
        netFlow
      ).toLocaleString()} to your savings each month.`,
      recommendation:
        "Set up an automatic transfer of 20% of incoming funds to a savings account.",
      confidence: 85,
      actionLabel: "Set savings goal",
    });
  }

  // Insight 4: Spending Spike Detection
  if (weeklyChange > 20) {
    insights.push({
      id: crypto.randomUUID(),
      type: "pattern",
      title: "Spending pattern detected",
      summary: `Your spending increased by ${Math.round(
        weeklyChange
      )}% compared to last week.`,
      detail: `The increase was primarily in ${topCategory.name.toLowerCase()} category. This could be a temporary fluctuation or a developing trend.`,
      impact:
        "If this trend continues, your monthly expenses could exceed your budget by 15-20%.",
      recommendation:
        "Review your recent transactions to understand what drove this increase.",
      confidence: Math.min(95, 70 + Math.floor(weeklyChange / 2)),
      actionLabel: "Analyze trend",
    });
  }

  // Insight 5: Recurring Payments (if detected)
  if (recurring.length >= 2) {
    insights.push({
      id: crypto.randomUUID(),
      type: "opportunity",
      title: "Subscription optimization",
      summary: `${recurring.length} recurring payments detected. Reviewing them could save you money.`,
      detail: recurring
        .slice(0, 3)
        .map((r) => `• ${r.name}: ~KES ${r.amount.toLocaleString()}/month`)
        .join("\n"),
      impact:
        "Optimizing unused subscriptions could save KES 2,000-5,000 monthly.",
      recommendation:
        "Review which recurring services you actually use regularly.",
      confidence: 87,
      actionLabel: "View subscriptions",
    });
  }

  return insights.slice(0, 5);
};
