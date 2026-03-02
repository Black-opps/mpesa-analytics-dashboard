export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  return /^(?:(?:\+254|0)[17]\d{8})$/.test(phone.replace(/\s/g, ""));
};

export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000;
};

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate;
};

export const isValidPassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8)
    errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Must contain a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  return { isValid: errors.length === 0, errors };
};
