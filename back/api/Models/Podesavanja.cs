namespace api.Models
{
    public class Podesavanja
    {
        public int id {  get; set; }

        public int korisnikId { get; set; }

        public string jezik { get; set; }

        public bool notifikacija { get; set; }

        public string status { get; set; }

        public string homeHK { get; set; }

        public string profileHK { get; set; }

        public string tasksHK {  get; set; }

        public string settingsHK { get; set; }

        public string logoutHK { get; set; }

        public int? temaId {  get; set; }

        public Korisnik korisnik { get; set; }

        public Tema tema { get; set; }

    }
}
