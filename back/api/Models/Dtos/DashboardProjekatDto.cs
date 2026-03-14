namespace api.Models.Dtos
{
    public class DashboardProjekatDto
    {
        public int id { get; set; }

        public string naziv { get; set; }

        // public string opis { get; set; } // za sada ovo nije potrebno na home

        public string prioritet { get; set; }

        public string pocetak { get; set; }

        public string kraj { get; set; }

        public int status { get; set; }

        public string role { get; set; }

        public List<Tuple<int, string>> progress_params { get; set; }

        public double progress_percentage { get; set; }

        public double timescale_percentage { get; set; } // timescale
    }
}
