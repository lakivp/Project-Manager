namespace api.Models
{
    public class UserResetPassToken
    {
        public int id { get; set; }
        public int userId { get; set; }

        public Guid token { get; set; }
    }
}
