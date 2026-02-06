namespace BlogApi.Services;

/// <summary>
/// Validação do critério mínimo de senha: 6+ caracteres, pelo menos uma letra maiúscula (A-Z) e pelo menos um dígito (0-9).
/// Aplica-se quando o utilizador ou Admin define uma senha; não se aplica à senha padrão definida pelo sistema.
/// </summary>
public static class PasswordValidation
{
    public const string ErrorMessage = "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número";

    /// <summary>
    /// Valida a senha. Retorna true se cumprir: comprimento ≥ 6, pelo menos um carácter A-Z, pelo menos um carácter 0-9.
    /// </summary>
    public static bool IsValid(string? password)
    {
        if (string.IsNullOrWhiteSpace(password)) return false;
        var pwd = password.Trim();
        if (pwd.Length < 6) return false;
        var hasUpper = pwd.Any(c => c >= 'A' && c <= 'Z');
        var hasDigit = pwd.Any(c => c >= '0' && c <= '9');
        return hasUpper && hasDigit;
    }
}
