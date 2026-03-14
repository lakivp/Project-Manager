namespace api.Models.Dtos
{
    public class AdminKorisniciDto
    {
        public int id { get; set; }

        public string ime { get; set; }

        public string prezime {  get; set; }

        public string username { get; set; }

        public string ulogaNaziv {  get; set; }

        public int status { get; set; }

        public string profilnaSlika { get; set; }
    }
}
