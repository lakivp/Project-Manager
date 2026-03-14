namespace api.Models.Dtos
{
    public class FilterTaskDto
    {
        public string naziv { get; set; }

        public string prioritet { get; set; }

        public string pocetak { get; set; }

        public string kraj { get; set; }

        public int? status { get; set; }

        public string labelNaziv { get; set; }

        public string projekatNaziv { get; set; }

        public int page_number { get; set; }
        
        public int page_size { get; set; }
    }
}
