namespace api.Models.Dtos
{
    public class TaskKorisnikDto
    {
        public int id { get; set; }

        public string naziv { get; set; }

        public string prioritet { get; set; }

        public string pocetak {  get; set; }

        public string kraj {  get; set; }

        public Task<string> labelName { get; set; }

        public Task<string> projectName { get; set; }

        public string korisnikIme { get; set; }

        public string korisnikPrezime { get; set; }

        public string korisnikSlika {  get; set; }
    }
}
