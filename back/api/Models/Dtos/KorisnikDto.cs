namespace api.Models.Dtos
{
    public class KorisnikDto
    {
        public string ime { get; set; }

        public string prezime { get; set; }

        public string username { get; set; }

        public string email { get; set; }

        public string password { get; set; }

        public int idUlogeAplikacija { get; set; }

        public int status { get; set; }

        public string phoneNumber { get; set; }

        public string? specijalizacija {  get; set; }

        public string opis {  get; set; }
    }
}
