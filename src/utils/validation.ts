export type ValidationResult = { valid: boolean; error?: string };

// ─── Primitives ──────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Accepts +1-800-555-0100, (800) 555-0100, 8005550100, etc.
  return /^\+?[\d\s\-().]{7,20}$/.test(phone.trim());
}

export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export function hasMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max;
}

// ─── Result-returning validators ─────────────────────────────────────────────

export function validateRequired(
  value: unknown,
  fieldName = 'This field',
): ValidationResult {
  if (!isRequired(value)) {
    return { valid: false, error: `${fieldName} is required.` };
  }
  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  const req = validateRequired(email, 'Email');
  if (!req.valid) return req;
  if (!isValidEmail(email)) return { valid: false, error: 'Enter a valid email address.' };
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  const req = validateRequired(phone, 'Phone');
  if (!req.valid) return req;
  if (!isValidPhone(phone)) return { valid: false, error: 'Enter a valid phone number.' };
  return { valid: true };
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName = 'This field',
): ValidationResult {
  if (!hasMinLength(value, min)) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters.` };
  }
  return { valid: true };
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName = 'This field',
): ValidationResult {
  if (!hasMaxLength(value, max)) {
    return { valid: false, error: `${fieldName} must be ${max} characters or fewer.` };
  }
  return { valid: true };
}
