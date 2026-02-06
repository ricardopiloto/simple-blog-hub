/** URL da imagem de capa usada quando o post não tem cover_image. */
export const DEFAULT_POST_COVER_IMAGE = '/placeholder.svg';

/** Critério mínimo de senha exibido junto aos formulários de senha (igual à validação da API). */
export const PASSWORD_CRITERIA_HELP = 'Mínimo 6 caracteres, uma letra maiúscula e um número';

/** Valida senha no cliente (mesma regra da API): ≥6 caracteres, pelo menos uma maiúscula (A-Z) e um dígito (0-9). */
export function isValidPassword(password: string): boolean {
  const pwd = password.trim();
  if (pwd.length < 6) return false;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  return hasUpper && hasDigit;
}
