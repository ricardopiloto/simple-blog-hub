namespace BlogApi.Services;

public interface IAdminService
{
    /// <summary>Returns true if the user identified by authorId has email matching Admin:Email (case-insensitive).</summary>
    Task<bool> IsAdminAsync(Guid authorId, CancellationToken cancellationToken = default);
}
