namespace api.Models.Dtos
{
    public class PodesavanjaDto
    {
        public int id { get; set; }
        public string jezik { get; set; }

        public bool notifikacija { get; set; }

        public string status { get; set; }

        public string homeHK { get; set; }

        public string profileHK { get; set; }

        public string tasksHK { get; set; }

        public string settingsHK { get; set; }

        public string logoutHK { get; set; }

        public int? temaId { get; set; }
    }
}
