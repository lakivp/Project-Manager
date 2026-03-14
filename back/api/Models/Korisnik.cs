namespace api.Models
{
    public class Korisnik
    {
        public int id { get; set; }
        public string ime { get; set; }
        public string prezime { get; set; }

        public string username {  get; set; }
        public string email { get; set; }
        public byte[] passwordHash { get; set; }

        public byte[] passwordSalt { get; set; }
        public int idUlogeAplikacija { get; set; }
        public int status { get; set; }
        public string imageURL { get; set; }
        public string phoneNumber { get; set; }
        public string? specijalizacija { get; set; }
        public string opis {  get; set; }
    }
}
