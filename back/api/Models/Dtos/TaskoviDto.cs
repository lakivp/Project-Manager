namespace api.Models.Dtos
{
    public class TaskoviDto
    {
        public int id { get; set; }

        public string naziv { get; set; }

        public string opis { get; set; }

        public string prioritet { get; set; }

        public string pocetak { get; set; }

        public string kraj { get; set; }

        public int idParent { get; set; }

        public int? idProjekat { get; set; }

        public int? idLabel { get; set; }

        public int status { get; set; }
    }
}
