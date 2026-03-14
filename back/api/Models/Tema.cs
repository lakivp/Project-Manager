namespace api.Models
{
    public class Tema
    {
        public int id {  get; set; }

        public string naziv {  get; set; }

        public string outer { get; set; }

        public string inner { get; set; }

        public string navBar { get; set; }

        public int? korisnikId { get; set; }

        public Korisnik korisnik { get; set; }
    }
}
