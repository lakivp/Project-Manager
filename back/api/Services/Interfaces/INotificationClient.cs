using api.Models;

namespace api.Services.Interfaces
{
    public interface INotificationClient
    {
        Task ReceiveNotification(string notification);
    }
}
