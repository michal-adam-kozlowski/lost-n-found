namespace LostNFound.Api.Models;

public class Chat
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ItemId { get; set; }
    public Guid ItemOwnerId { get; set;  }
    public Guid InquirerId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastMessageAt { get; set; }


    public Item Item { get; set; } = null!;
    public ApplicationUser ItemOwner { get; set; } = null!;
    public ApplicationUser Inquirer { get; set; } = null!;
    public ICollection<ChatMessage> Messages { get; set; } = [];
}
