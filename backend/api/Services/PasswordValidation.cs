namespace BlogApi.Services;

/// <summary>
/// Validação do critério mínimo de senha: 8+ caracteres, pelo menos uma maiúscula, uma minúscula e um dígito.
/// Aplica-se quando o utilizador ou Admin define uma senha; não se aplica à senha padrão definida pelo sistema.
/// </summary>
public static class PasswordValidation
{
    public const string ErrorMessage = "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número";

    /// <summary>
    /// Valida a senha. Retorna true se cumprir: comprimento ≥ 8, pelo menos um A-Z, um a-z e um 0-9.
    /// </summary>
    public static bool IsValid(string? password)
    {
        if (string.IsNullOrWhiteSpace(password)) return false;
        var pwd = password.Trim();
        if (pwd.Length < 8) return false;
        var hasUpper = pwd.Any(c => c >= 'A' && c <= 'Z');
        var hasLower = pwd.Any(c => c >= 'a' && c <= 'z');
        var hasDigit = pwd.Any(c => c >= '0' && c <= '9');
        return hasUpper && hasLower && hasDigit;
    }
}
