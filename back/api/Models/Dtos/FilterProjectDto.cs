namespace api.Models.Dtos
{
    public class FilterProjectDto
    {
        public int user_id { get; set; }
        public string naziv { get; set; }

        public List<string> prioritet { get; set; }

        public string pocetak { get; set; }

        public string kraj { get; set; }

        public int status { get; set; }
        
        public string role { get; set; }

        public int progress_greater_than { get; set; }

        public int progress_lesser_than { get; set; }

        public bool progress_filter_as_union {  get; set; } 

        public int page_number { get; set; }

        public int page_size { get; set; }
    }
}
