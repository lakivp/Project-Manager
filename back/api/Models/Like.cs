namespace api.Models
{
    public class Like
    {
        public int id {  get; set; }

        public int korisnikId { get; set; }

        public int komentarId { get; set; }

        public Korisnik Korisnik { get; set; }

        public Komentar Komentar { get; set; }
    }
}