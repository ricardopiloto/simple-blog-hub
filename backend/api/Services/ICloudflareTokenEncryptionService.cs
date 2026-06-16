namespace BlogApi.Services;

public interface ICloudflareTokenEncryptionService
{
    string Encrypt(string plainText);
    string Decrypt(string cipherText);
}
