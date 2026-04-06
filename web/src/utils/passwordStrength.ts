export interface PasswordCheck {
  label: string;
  pass:  boolean;
}

export interface PasswordStrength {
  score:  number;            // 0–5
  level:  'weak' | 'fair' | 'good' | 'strong';
  label:  string;
  checks: PasswordCheck[];
}

export function checkPasswordStrength(pw: string): PasswordStrength {
  const checks: PasswordCheck[] = [
    { label: 'At least 8 characters',     pass: pw.length >= 8 },
    { label: 'Uppercase letter (A–Z)',     pass: /[A-Z]/.test(pw) },
    { label: 'Lowercase letter (a–z)',     pass: /[a-z]/.test(pw) },
    { label: 'Number (0–9)',               pass: /\d/.test(pw) },
    { label: 'Special character (!@#$…)',  pass: /[^A-Za-z0-9]/.test(pw) },
  ];

  const score = checks.filter((c) => c.pass).length;

  const [level, label]: [PasswordStrength['level'], string] =
    score <= 2 ? ['weak',   'Weak']   :
    score === 3 ? ['fair',   'Fair']   :
    score === 4 ? ['good',   'Good']   :
                  ['strong', 'Strong'];

  return { score, level, label, checks };
}

/** Minimum strength required to create an account */
export function isStrongEnough(s: PasswordStrength): boolean {
  return s.score >= 4;
}
