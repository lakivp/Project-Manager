namespace api.Models
{
    public class LabelRedosled
    {
        public int id { get; set; }
        public string order { get; set; }
        public int idProjekat { get; set; }
        public Projekat projekat { get; set; }
    }
}
