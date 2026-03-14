using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class UlogaKorisnikProjekat
    {
        public int id { get; set; }

        public int idProjekat { get; set; }

        public int idKorisnik {  get; set; }

        public int idUloga {  get; set; }

        public int status {  get; set; }

        public Projekat projekat { get; set; }

        public Korisnik korisnik { get; set; }

        public UlogaProjekat uloga {  get; set; }
    }
}
