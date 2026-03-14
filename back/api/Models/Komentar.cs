namespace api.Models
{
    public class Komentar
    {
        public int id {  get; set; }

        public string text { get; set; }

        public int autorId { get; set; }

        public int taskId { get; set; }

        public int? parentId { get; set; }

        public Korisnik Korisnik { get; set; }

        public Taskovi Task { get; set; }
    }
}
