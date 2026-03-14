namespace api.Models
{
    public class Obavestenje
    {
        public int id { get; set; }

        public string text { get; set; }

        public int isRead { get; set; }

        public DateTime dateCreated { get; set; }


    }
}
