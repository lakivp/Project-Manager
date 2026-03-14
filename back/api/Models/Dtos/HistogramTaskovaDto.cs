namespace api.Models.Dtos
{
    public class HistogramTaskovaDto
    {
        public int korisnikId { get; set; }

        public string username { get; set; }

        public string imageUrl { get; set; }

        public int lowTasks { get; set; }

        public int mediumTasks { get; set; }

        public int highTasks { get; set; }
    }
}
