using System.Security.Cryptography;
using System.Text;

namespace BlogApi.Services;

public class CloudflareTokenEncryptionService : ICloudflareTokenEncryptionService
{
    private readonly IConfiguration _configuration;
    private byte[]? _key;

    public CloudflareTokenEncryptionService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string Encrypt(string plainText)
    {
        if (plainText == null)
            throw new ArgumentNullException(nameof(plainText));

        var key = GetKey();
        var nonce = RandomNumberGenerator.GetBytes(12);
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var cipherBytes = new byte[plainBytes.Length];
        var tag = new byte[16];

        using var aes = new AesGcm(key, 16);
        aes.Encrypt(nonce, plainBytes, cipherBytes, tag);

        var payload = new byte[nonce.Length + tag.Length + cipherBytes.Length];
        Buffer.BlockCopy(nonce, 0, payload, 0, nonce.Length);
        Buffer.BlockCopy(tag, 0, payload, nonce.Length, tag.Length);
        Buffer.BlockCopy(cipherBytes, 0, payload, nonce.Length + tag.Length, cipherBytes.Length);
        return Convert.ToBase64String(payload);
    }

    public string Decrypt(string cipherText)
    {
        if (string.IsNullOrEmpty(cipherText))
            throw new ArgumentException("Cipher text is required.", nameof(cipherText));

        var key = GetKey();
        var payload = Convert.FromBase64String(cipherText);
        if (payload.Length < 12 + 16)
            throw new CryptographicException("Invalid encrypted token payload.");

        var nonce = payload.AsSpan(0, 12);
        var tag = payload.AsSpan(12, 16);
        var cipherBytes = payload.AsSpan(28);
        var plainBytes = new byte[cipherBytes.Length];

        using var aes = new AesGcm(key, 16);
        aes.Decrypt(nonce, cipherBytes, tag, plainBytes);
        return Encoding.UTF8.GetString(plainBytes);
    }

    private byte[] GetKey()
    {
        if (_key != null)
            return _key;

        var keyRaw = _configuration["Cloudflare:EncryptionKey"]?.Trim();
        if (string.IsNullOrEmpty(keyRaw))
            throw new InvalidOperationException("Cloudflare:EncryptionKey is not configured. Set Cloudflare__EncryptionKey before storing Cloudflare API tokens.");

        _key = DecodeKey(keyRaw);
        if (_key.Length != 32)
            throw new InvalidOperationException("Cloudflare:EncryptionKey must decode to exactly 32 bytes (AES-256). Use base64 or 64 hex characters.");

        return _key;
    }

    private static byte[] DecodeKey(string keyRaw)
    {
        if (keyRaw.Length == 64 && keyRaw.All(c => Uri.IsHexDigit(c)))
            return Convert.FromHexString(keyRaw);

        try
        {
            return Convert.FromBase64String(keyRaw);
        }
        catch (FormatException ex)
        {
            throw new InvalidOperationException("Cloudflare:EncryptionKey must be base64 (32 bytes) or 64 hex characters.", ex);
        }
    }
}
