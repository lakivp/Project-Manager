using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class ObavestenjeKorisnik
    {
        public int id { get; set; }

        public int idObavestenje {  get; set; }

        public int idKorisnik { get; set; }

        public Obavestenje obavestenje { get; set; }

        public Korisnik korisnik { get; set; }
    }
}
