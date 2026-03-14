using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Projekat
    {
        public int id {  get; set; }

        public string naziv { get; set; }

        public string opis { get; set; }

        public string prioritet { get; set; }

        public string pocetak { get; set; }
        
        public string kraj {  get; set; }

        public int status { get; set; }
    }
}
